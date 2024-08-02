import { render, screen, cleanup } from '@testing-library/react';
import HeatMap from '../map';
import L from "leaflet";

// Mock Leaflet's map and heat layer
jest.mock("leaflet", () => ({
  map: jest.fn().mockReturnThis(),
  tileLayer: jest.fn().mockReturnThis(),
  control: {
    zoom: jest.fn().mockReturnThis()
  },
  heatLayer: jest.fn().mockReturnThis(),
  geoJson: jest.fn().mockReturnThis(),
  latLngBounds: jest.fn().mockReturnValue({}),
  latLng: jest.fn().mockReturnValue({}),
  DomEvent: {
    stopPropagation: jest.fn()
  }
}));

describe('HeatMap Component', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<HeatMap mapData={[]} containerId="m" showCompare={false} updateState={() => {}} graphData={{}} radius={20} predict={false} />);
    expect(screen.getByTestId('m')).toBeInTheDocument();
  });

  it('initializes a Leaflet map on first render', () => {
    const containerId = 'm';
    render(<HeatMap mapData={[]} containerId={containerId} showCompare={false} updateState={() => {}} graphData={{}} radius={20} predict={false} />);
    expect(L.map).toHaveBeenCalledWith(containerId, expect.anything());
  });

  it('updates heat map layer when mapData changes', () => {
    const { rerender } = render(<HeatMap mapData={[[34.05, -118.25, 5]]} containerId="m" showCompare={false} updateState={() => {}} graphData={{}} radius={20} predict={false} />);
    expect(L.heatLayer).toHaveBeenCalledWith([[34.05, -118.25, 5]], expect.anything());

    // Update mapData
    rerender(<HeatMap mapData={[[34.05, -118.25, 10]]} containerId="m" showCompare={false} updateState={() => {}} graphData={{}} radius={20} predict={false} />);
    // Verify heatLayer is called with new data
    expect(L.heatLayer).toHaveBeenCalledWith([[34.05, -118.25, 10]], expect.anything());
  });

});

