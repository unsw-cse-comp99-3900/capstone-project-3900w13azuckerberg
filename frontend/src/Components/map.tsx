import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { FeatureCollection } from 'geojson';
import stateMapping from "./states.json";

interface HeatMapProps {
  mapData: [number, number, number][];
  containerId: string;
  showCompare: boolean;
  updateState: (state: string) => void;
  currentState: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ mapData, containerId, showCompare, currentState, updateState }) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  
  const createMap = () => {
    const australiaBounds = L.latLngBounds(
      L.latLng(-45.2, 80),
      L.latLng(-8.0, 200),
    );

    const map = L.map(containerId, {
      center: [-28.0, 135],
      zoom: 5,
      zoomControl: false,
      maxBounds: australiaBounds,
      minZoom: 4,
    });
    
    // Add a tile layer to the map (OpenStreetMap)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    const states: FeatureCollection = stateMapping as FeatureCollection;
    const geoJsonLayer = L.geoJson(states, {
      onEachFeature: (feature, layer) => {
        let tooltip: L.Tooltip;
  
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 1,
              color: 'white',
              dashArray: '',
              fillOpacity: 0.1
            });
            layer.bringToFront();
  
            // contents can be a htmlElement too for more advanced displays
            const content = `${feature.properties.STATE_NAME} - Cases: 0`;
            tooltip = L.tooltip({
              direction: 'top',
              permanent: false, 
              sticky: true,
              opacity: 0.7,
              className: "tooltip"
            })
            .setContent(content)
            .setLatLng(e.latlng)
            .openOn(map);
          },
          mousemove: (e) => {
            tooltip.setLatLng(e.latlng);
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
            map.closeTooltip(tooltip);
          },
          click: (e) => {
            map.fitBounds(e.target.getBounds(), { padding: [20, 10], animate: true});
            updateState(feature.properties.STATE_NAME);
          }
        });
      },
      style: {
        color: "white",
        weight: 1,
        opacity: 0.1,
        fillOpacity: 0
      }
    }).addTo(map);

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }

  useEffect(() => {
    if (!mapRef.current && containerId === "m") {
        return createMap();
    }
  }, [containerId]);

  useEffect(() => {
    if (!mapRef.current && showCompare) {
        return createMap();
    }
  }, [showCompare]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      if (heatLayerRef.current) {
        heatLayerRef.current?.remove();
        heatLayerRef.current = null;

      }
      const max = mapData.reduce((acc, point) => Math.max(acc, point[2]), 0) || 1;
      const heatLayer = L.heatLayer(mapData, {
        minOpacity: 0.6,
        maxZoom: 1,
        max,
        radius: 20,
        blur: 15,
        gradient: {0: "midnightblue", 0.33: "rebeccapurple", 0.67: "orangered", 1: "yellow" },
      }).addTo(map);

      heatLayerRef.current = heatLayer;
    }
  }, [mapData]);

  return <div id={containerId} style={{ height: "100vh", width: "100%", zIndex: 0 }}></div>;
};

export default HeatMap;
