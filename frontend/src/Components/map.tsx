import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { FeatureCollection } from 'geojson';
import stateMapping from "./states.json";
import { DateData, RegionData } from "./types";

interface HeatMapProps {
  mapData: [number, number, number][];
  containerId: string;
  showCompare: boolean;
  updateState: (state: string) => void;
  currentState: string;
  graphData: DateData;
  radius: number;
}

const HeatMap: React.FC<HeatMapProps> = ({ mapData, containerId, showCompare, currentState, updateState, radius, graphData }) => {
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
        attribution:`
        &copy; <a href="https://gisaid.org/">GISAID</a>
        &copy; <a href="https://www.aph.gov.au/Parliamentary_Business/Committees/Joint/Public_Accounts_and_Audit/DFATcrisismanagement/Report_494_Inquiry_into_the_Department_of_Foreign_Affairs_and_Trades_crisis_management_arrangem/C_Timeline_of_key_events">Australian Parliament House</a> 
        &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
        &copy; <a href="https://carto.com/attributions">CARTO</a> 
        `,
      },
    ).addTo(map);

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }

  // useEffect(() => {
  //   console.log("Updated currentState:", currentState);
  // }, [currentState]);

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

      const states: FeatureCollection = stateMapping as FeatureCollection;
      const geoJsonLayer = L.geoJson(states, {
        onEachFeature: (feature, layer) => {
          let tooltip: L.Tooltip;
          const state = feature.properties.STATE_NAME;

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

              let cases: RegionData;
              let result = 0;
              if (graphData && graphData[state]) {
                cases = graphData[state];
                for (const [strain, count] of Object.entries(cases)) {
                    result += count;
                }
              }

              const content = `${state} - ${result} total covid cases`;
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
              updateState(state);
              L.DomEvent.stopPropagation(e);
            }
          });
        },
        style: {
          color: "#494949",
          weight: 1,
          opacity: 0.1,
          fillOpacity: 0
        }
      }).addTo(map);

      map.on('click', () => {
        updateState('Australia');
      });
    }
  })

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
        radius: radius,
        blur: 15,
        gradient: {0: "midnightblue", 0.33: "rebeccapurple", 0.67: "orangered", 1: "yellow" },
      }).addTo(map);

      heatLayerRef.current = heatLayer;
    }
  }, [mapData, radius]);

  return <div id={containerId} style={{ height: "100vh", width: "100%", zIndex: 0 }}></div>;
};

export default HeatMap;
