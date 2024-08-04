import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

// Mock child components
jest.mock('./Components/main', () => ({ containerId }: { containerId: string }) => <div data-testid={`main-${containerId}`}>Main Component</div>);
jest.mock('./Components/slider', () => ({ date, onDateChange }: { date: Date, onDateChange: (date: Date) => void }) => (
  <input 
    type="date" 
    data-testid="date-slider" 
    value={date.toISOString().split('T')[0]} 
    onChange={(e) => onDateChange(new Date(e.target.value))}
  />
));
jest.mock('./Components/legend', () => () => <div data-testid="legend">Legend</div>);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('date-slider')).toBeInTheDocument();
    expect(screen.getByTestId('main-m')).toBeInTheDocument();
  });

  it('updates date when slider changes', () => {
    render(<App />);
    const dateSlider = screen.getByTestId('date-slider');
    fireEvent.change(dateSlider, { target: { value: '2021-01-01' } });
    expect(dateSlider).toHaveValue('2021-01-01');
  });

  it('shows loading overlay when isLoading is true', async () => {
    render(<App />);
    const mainComponent = screen.getByTestId('compare-button');
    await act(async () => {
      fireEvent.click(mainComponent); 
    });
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
  });

  it('toggles compare view', async () => {
    render(<App />);
    const mainComponent = screen.getByTestId('compare-button');
    await act(async () => {
      fireEvent.click(mainComponent); 
    });
    expect(screen.getByTestId('main-left')).toBeInTheDocument();
    expect(screen.getByTestId('main-right')).toBeInTheDocument();
  });

  it('updates date when predict changes', async () => {
    jest.useFakeTimers();
    render(<App />);
    const mainComponent = screen.getByTestId('predict-button');
    await act(async () => {
      fireEvent.click(mainComponent); 
    });
    jest.runAllTimers();
    expect(screen.getByTestId('date-slider')).toHaveValue('2025-01-01');
    jest.useRealTimers();
  });


});