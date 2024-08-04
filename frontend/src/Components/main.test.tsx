import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Main from './main';
import { PieItem, LineItem, BarItem } from './types'; 

type GraphBarProps = {
    pieData: PieItem[];
    lineData: LineItem[];
    barData: BarItem;
};

type HeatMapProps = {
mapData: [number, number, number][];
};

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock child components
jest.mock('./GraphBar', () => ({ pieData, lineData, barData }: GraphBarProps) => (
  <div data-testid="graph-bar">
    <div data-testid="pie-data">{JSON.stringify(pieData)}</div>
    <div data-testid="line-data">{JSON.stringify(lineData)}</div>
    <div data-testid="bar-data">{JSON.stringify(barData)}</div>
  </div>
));
jest.mock('./map', () => ({ mapData }: HeatMapProps) => <div data-testid="heat-map">{JSON.stringify(mapData)}</div>);
jest.mock('./filters', () => () => <div data-testid="filters">Filters</div>);
jest.mock('./radiusSlider', () => () => <div data-testid="radius-slider">RadiusSlider</div>);

describe('Main Component', () => {
  const defaultProps = {
    setIsLoading: jest.fn(),
    date: new Date('2024-01-01'),
    showCompare: false,
    setShowCompare: jest.fn(),
    containerId: 'test-container',
    predict: false,
    setPredict: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Main {...defaultProps} />);
    expect(screen.getByTestId('graph-bar')).toBeInTheDocument();
    expect(screen.getByTestId('heat-map')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('radius-slider')).toBeInTheDocument();
  });

  it('fetches map data on mount and updates state', async () => {
    const mockMapData = {
      '2024-01-01': [[1, 2, 3], [4, 5, 6]],
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockMapData });

    await act(async () => {
      render(<Main {...defaultProps} />);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:5001/map', {
        params: { containerId: 'test-container' },
      });
      expect(screen.getByTestId('heat-map')).toHaveTextContent(JSON.stringify([[1, 2, 3], [4, 5, 6]]));
    });
  });

  it('fetches graph data after map data is loaded and updates state', async () => {
    const mockMapData = {
      '2024-01-01': [[1, 2, 3], [4, 5, 6]],
    };
    const mockGraphData = {
      '2024-01-01': {
        'Australia': { Alpha: 10, Beta: 20, Delta: 30, Gamma: 40, Omicron: 50 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockMapData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockGraphData });

    await act(async () => {
      render(<Main {...defaultProps} />);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:5001/graphdata', {
        params: { containerId: 'test-container' },
      });
      const pieData = JSON.parse(screen.getByTestId('pie-data').textContent || '[]');
      expect(pieData).toHaveLength(5);
      expect(pieData[0]).toHaveProperty('value', 10);
    });
  });

  it('updates pie and line data when date or location changes', async () => {
    const mockMapData = {
      '2024-01-01': [[1, 2, 3]],
      '2024-01-02': [[4, 5, 6]],
    };
    const mockGraphData = {
      '2024-01-01': {
        'Australia': { Alpha: 10, Beta: 20 },
        'New South Wales': { Alpha: 5, Beta: 10 },
      },
      '2024-01-02': {
        'Australia': { Alpha: 15, Beta: 25 },
        'New South Wales': { Alpha: 8, Beta: 12 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockMapData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockGraphData });

    const { rerender } = await act(async () => {
      return render(<Main {...defaultProps} />);
    });

    await waitFor(() => {
      const pieData = JSON.parse(screen.getByTestId('pie-data').textContent || '[]');
      expect(pieData).toHaveLength(2);
      expect(pieData[0]).toHaveProperty('value', 10);
    });

    // Change date
    await act(async () => {
      rerender(<Main {...defaultProps} date={new Date('2024-01-02')} />);
    });

    await waitFor(() => {
      const pieData = JSON.parse(screen.getByTestId('pie-data').textContent || '[]');
      expect(pieData).toHaveLength(2);
      expect(pieData[0]).toHaveProperty('value', 15);
    });
  });

  it('fetches and processes predictive data when predict is true', async () => {
    const mockPredictiveMapData = {
      '2024-01-01': [[1, 2, 3]],
    };
    const mockPredictiveGraphData = {
      '2024-01-01': {
        'Australia': { numI: 100, numR: 200, numE: 300 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockPredictiveMapData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockPredictiveGraphData });

    await act(async () => {
      render(<Main {...defaultProps} predict={true} />);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:5001/predictive_map', {
        params: { containerId: 'test-container' },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:5001/predictive_graphdata', {
        params: { containerId: 'test-container' },
      });
      const lineData = JSON.parse(screen.getByTestId('line-data').textContent || '[]');
      expect(lineData).toHaveLength(1);
      expect(lineData[0]).toHaveProperty('id', 'Total Predicted Cases');
    });
  });

  it('updates bar data when allBarData changes', async () => {
    const mockMapData = { '2024-01-01': [[1, 2, 3]] };
    const mockGraphData = { '2024-01-01': { 'Australia': { Alpha: 10 } } };
    const mockBarData = {
      '2024-01-01': {
        'Australia': { numI: 100, numR: 200, numE: 300 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockMapData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockGraphData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockBarData });

    await act(async () => {
      render(<Main {...defaultProps} />);
    });

    await waitFor(() => {
      const barData = JSON.parse(screen.getByTestId('bar-data').textContent || '{}');
      expect(barData).toHaveProperty('Infected', 100);
      expect(barData).toHaveProperty('Recovered', 200);
      expect(barData).toHaveProperty('Exposed', 300);
    });
  });

});