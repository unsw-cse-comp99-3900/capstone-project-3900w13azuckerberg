import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import './map.css';
import axios from 'axios';

const HeatMap: React.FC = () => {
    const [heatMapData, setHeatMapData] = useState<[number, number, number][]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/map');
                const data = response.data.data;

                // Transform data into heat map format
                const heatMapPoints: [number, number, number][] = data.flatMap((day: any) => 
                    day.cases.map((caseItem: any) => [
                        caseItem.latitude, 
                        caseItem.longitude, 
                        caseItem.intensity
                    ])
                );

                setHeatMapData(heatMapPoints);
            } catch (error) {
                console.error('Error fetching heat map data:', error);
            }
        };

        fetchData();
    }, []);
    
    useEffect(() => {
        const australiaBounds = L.latLngBounds(
            L.latLng(-45.2, 80),
            L.latLng(-8.0, 200)
        );

        // Initialize the map and set its view
        const map = L.map('map', {
            center: [-28.0, 135],
            zoom: 5, 
            zoomControl: false,
            maxBounds: australiaBounds,
            minZoom: 4

        });

        // Add a tile layer to the map (OpenStreetMap)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }).addTo(map);

        L.control.zoom({
            position: 'bottomleft' // Position the zoom control at the bottom right
        }).addTo(map);

        // Add heat map layer to the map
        L.heatLayer(heatMapData, {
            radius: 25,  // Radius of each "point" of the heatmap
            blur: 17,    // Amount of blur
            maxZoom: 1, // Maximum zoom level
            gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'},
        }).addTo(map);
        
        // Clean up the map instance onx component unmount
        return () => {
            map.remove();
        };
    }, [heatMapData]);

    return (
        <div id="map" style={{ height: '100vh', width: '100%' }}>
        </div>
    );
};

export default HeatMap;

    
    