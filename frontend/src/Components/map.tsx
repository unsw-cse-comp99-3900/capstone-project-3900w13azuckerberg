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
  const mapContainerRef = useRef<L.Map | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const australiaBounds = L.latLngBounds(
      L.latLng(-50, 80),
      L.latLng(-8.0, 200),
    );

    // Initialize the map and set its view
    const map = L.map("map", {
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

            const content = `${feature.properties.STATE_NAME} - Cases: 0`;
            tooltip = L.tooltip({
              direction: 'right',
              permanent: false, 
              sticky: true,
              opacity: 0.9
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

    if (currentState !== "All") {
      map.on('zoomend', () => updateState("All"));
      map.on('dragend', () => updateState("All"));
    }
    
    mapRef.current = map;
  });

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      if (heatLayerRef.current) {
        heatLayerRef.current.remove();
      }
      let max = mapData.reduce((acc, point) => Math.max(acc, point[2]), 0);
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

  return <div id="map" style={{ height: "100vh", width: "100%", zIndex: 0 }}></div>;
};

export default HeatMap;

//   // const mapContainerElement = document.getElementById(containerId);
//   useEffect(() => {
//     const australiaBounds = L.latLngBounds(
//       L.latLng(-45.2, 80),
//       L.latLng(-8.0, 200),
//     );
//     console.log(containerId);
//     // Initialize the map and set its view
//     // if (mapContainerElement && !mapContainerRef.current) {
//     if (!mapContainerRef.current) {
//       if (containerId == "M") {
//           mapContainerRef.current = L.map(containerId, {
//           center: [-28.0, 135],
//           zoom: 5,
//           zoomControl: false,
//           maxBounds: australiaBounds,
//           minZoom: 4,
//         });

//         // Add a tile layer to the map (OpenStreetMap)
//         L.tileLayer(
//           "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
//           {
//             maxZoom: 18,
//             attribution:
//               '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//           },
//         ).addTo(mapContainerRef.current);

//         L.control
//           .zoom({
//             position: "bottomleft", // Position the zoom control at the bottom right
//           })
//           .addTo(mapContainerRef.current);

//         // Add heat map layer to the map
//         L.heatLayer(mapData, {
//           radius: 25, // Radius of each "point" of the heatmap
//           blur: 17, // Amount of blur
//           maxZoom: 1, // Maximum zoom level
//           gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
//         }).addTo(mapContainerRef.current);
          

//     }
//       // Clean up the map instance onx component unmount
//       return () => {
//         mapContainerRef.current?.remove();
//         mapContainerRef.current = null;
//       };
//     }
//   }, [mapData]);



//   useEffect(() => {
//     const australiaBounds = L.latLngBounds(
//       L.latLng(-50, 80),
//       L.latLng(-8.0, 200),
//     );

//     // Initialize the map and set its view
//     // if (mapContainerElement && !mapContainerRef.current) {
//     if (!mapContainerRef.current && showCompare) {
//       if (containerId != "main") {
//           mapContainerRef.current = L.map(containerId, {
//           center: [-28.0, 135],
//           zoom: 5,
//           zoomControl: false,
//           maxBounds: australiaBounds,
//           minZoom: 4,
//         });

//         // Add a tile layer to the map (OpenStreetMap)
//         L.tileLayer(
//           "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
//           {
//             maxZoom: 18,
//             attribution:
//               '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//           },
//         ).addTo(mapContainerRef.current);

//         L.control
//           .zoom({
//             position: "bottomleft", // Position the zoom control at the bottom right
//           })
//           .addTo(mapContainerRef.current);

//         // Add heat map layer to the map
//         L.heatLayer(mapData, {
//           radius: 25, // Radius of each "point" of the heatmap
//           blur: 17, // Amount of blur
//           maxZoom: 1, // Maximum zoom level
//           gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
//         }).addTo(mapContainerRef.current);
//       }
//     }
//     // Clean up the map instance onx component unmount
//     return () => {
//       mapContainerRef.current?.remove();
//       mapContainerRef.current = null;
//     };
    
//   }, [showCompare, mapData]);

//   return <div id={containerId} style={{ height: "100vh", width: "100%" }}></div>;
// };

// export default HeatMap;
