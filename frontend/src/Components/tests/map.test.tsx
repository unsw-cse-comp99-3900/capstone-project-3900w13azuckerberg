// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import HeatMap from '../map';
// import { stringify } from 'querystring';

// // Mock Leaflet
// jest.mock('leaflet', () => {
//   const originalModule = jest.requireActual('leaflet');
//   return {
//     ...originalModule,
//     map: jest.fn(() => ({
//       setView: jest.fn(),
//       remove: jest.fn(),
//       on: jest.fn(),
//       closeTooltip: jest.fn(),
//       fitBounds: jest.fn(),
//       addLayer: jest.fn(),
//     })),
//     tileLayer: jest.fn(() => ({
//       addTo: jest.fn(),
//     })),
//     control: {
//       zoom: jest.fn(() => ({
//         addTo: jest.fn(),
//       })),
//     },
//     latLngBounds: jest.fn(),
//     latLng: jest.fn(),
//     geoJson: jest.fn(() => ({
//       addTo: jest.fn(),
//       resetStyle: jest.fn(),
//       on: jest.fn(),
//     })),
//     heatLayer: jest.fn(() => ({
//       addTo: jest.fn(),
//       remove: jest.fn(),
//     })),
//     tooltip: jest.fn(() => ({
//       setContent: jest.fn().mockReturnThis(),
//       setLatLng: jest.fn().mockReturnThis(),
//       openOn: jest.fn(),
//       remove: jest.fn(),
//     })),
//     DomEvent: {
//       stopPropagation: jest.fn(),
//     },
//   };
// });

// // Mock the stateMapping import
// jest.mock('../states.json', () => ({
//   type: 'FeatureCollection',
//   features: [
//     {
//       type: 'Feature',
//       properties: { STATE_NAME: 'Test State' },
//       geometry: { type: 'Polygon', coordinates: [[]] },
//     },
//   ],
// }));

// describe('HeatMap Component', () => {
//   const mapData: [number, number, number][] = [
//     [34.0522, -118.2437, 0.5],
//     [36.1699, -115.1398, 0.8],
//   ];
//   const mapProps = {
//     mapData: mapData,
//     containerId: 'm',
//     showCompare: false,
//     updateState: jest.fn(),
//     graphData: { 'Test State': { 'Alpha': 10 } },
//     radius: 10,
//     predict: false,
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders HeatMap component', () => {
//     render(<HeatMap {...mapProps} />);
//     expect(screen.getByTestId('m')).toBeInTheDocument();
//   });

//   test('creates map when containerId is "m"', () => {
//     render(<HeatMap {...mapProps} />);
//     expect(require('leaflet').map).toHaveBeenCalledWith('m', expect.any(Object));
//   });

//   test('creates map when showCompare is true', () => {
//     render(<HeatMap {...mapProps} showCompare={true} />);
//     expect(require('leaflet').map).toHaveBeenCalled();
//   });

//   test('adds geoJson layer to map', () => {
//     render(<HeatMap {...mapProps} />);
//     expect(require('leaflet').geoJson).toHaveBeenCalled();
//   });

//   test('adds heat layer to map', () => {
//     render(<HeatMap {...mapProps} />);
//     expect(require('leaflet').heatLayer).toHaveBeenCalledWith(mapProps.mapData, expect.any(Object));
//   });
  
// });