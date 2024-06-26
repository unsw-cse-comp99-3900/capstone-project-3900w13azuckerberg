import React from 'react';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

function Map() {
  return (
    <MapContainer center={[-25.2744, 133.7751]} zoom={4} style={{ height: "100vh", width: "100%", filter: "invert(1) hue-rotate(180deg) grayscale(0.7)" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}



export default Map