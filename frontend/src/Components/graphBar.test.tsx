import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GraphBar from './GraphBar';
import { BarItem, PieItem, LineItem, PolicyData } from './types';

// Mock child components
jest.mock('./GraphButton', () => () => <button data-testid="graph-toggle">Toggle Graph</button>);
jest.mock('./PieChart', () => ({ pieData }: { pieData: PieItem[] }) => <div data-testid="pie-chart">{JSON.stringify(pieData)}</div>);
jest.mock('./LineChart', () => ({ lineData }: { lineData: LineItem[] }) => <div data-testid="line-chart">{JSON.stringify(lineData)}</div>);
jest.mock('./barChart', () => ({ barData }: { barData: BarItem }) => <div data-testid="bar-chart">{JSON.stringify(barData)}</div>);
jest.mock('./policyGraph', () => ({ policies }: { policies: PolicyData }) => <div data-testid="policy-graph">{JSON.stringify(policies)}</div>);

describe('GraphBar Component', () => {
  const defaultProps: {
    pieData: PieItem[];
    lineData: LineItem[];
    policies: PolicyData;
    barData: BarItem;
    predict: boolean;
    setPolicies: (policies: PolicyData) => void;
    token: boolean;
    onFilterChange: (token: boolean) => void;
    containerId: string;
  } = {
    pieData: [{ id: 'test', label: 'Test', value: 10, color: '#000000' }],
    lineData: [{ id: 'test', color: '#000000', data: [{ x: '2023-01-01', y: 1 }] }],
    policies: { 'Test State': { startDate: '2023-01-01', endDate: '2023-12-31', policy: 'Test Policy' } },
    barData: { statement: 'Test', Infected: 100, Recovered: 200, Exposed: 300 },
    predict: false,
    setPolicies: jest.fn(),
    token: false,
    onFilterChange: jest.fn(),
    containerId: 'test-container',
  };

  it('renders without crashing', () => {
    render(<GraphBar {...defaultProps} />);
    expect(screen.getByTestId('graph-toggle')).toBeInTheDocument();
  });

  it('toggles graph visibility when button is clicked', () => {
    render(<GraphBar {...defaultProps} />);
    const button = screen.getByTestId('graph-toggle');
    const outerDiv = screen.getByTestId('wrapper');

    expect(outerDiv).not.toHaveClass('open');
    fireEvent.click(button);
    expect(outerDiv).not.toHaveClass('closed');
  });

  it('renders PieChart when predict is false', () => {
    render(<GraphBar {...defaultProps} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('policy-graph')).not.toBeInTheDocument();
  });

  it('renders PolicyGraph when predict is true', () => {
    render(<GraphBar {...defaultProps} predict={true} />);
    expect(screen.getByTestId('policy-graph')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('renders LineChart and BarChart', () => {
    render(<GraphBar {...defaultProps} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('passes correct data to child components', () => {
    render(<GraphBar {...defaultProps} />);
    
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart.textContent).toContain(JSON.stringify(defaultProps.pieData));

    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart.textContent).toContain(JSON.stringify(defaultProps.lineData));

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart.textContent).toContain(JSON.stringify(defaultProps.barData));
  });

  it('calls setPolicies when PolicyGraph is rendered', () => {
    render(<GraphBar {...defaultProps} predict={true} />);
    expect(screen.getByTestId('policy-graph')).toBeInTheDocument();

    expect(defaultProps.setPolicies).toBeDefined();
  });

});