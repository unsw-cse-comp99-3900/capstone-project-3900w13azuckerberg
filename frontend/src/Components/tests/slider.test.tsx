import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import axios from 'axios';
import Main from '../main';
import Slider from '../slider';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock react-calendar
jest.mock('react-calendar', () => {
  return function DummyCalendar(props: any) {
    return (
      <div data-testid="mock-calendar">
        <button onClick={() => props.onClickDay(new Date(2023, 0, 15))}>Jan 15</button>
        <button onClick={() => props.onClickDay(new Date(2023, 0, 20))}>Jan 20</button>
      </div>
    );
  };
});

// Mock CustomTooltip and PolicyTooltip
jest.mock('../customTooltip', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('../policyToolTip', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);

describe('Slider Component', () => {
  const mockOnDateChange = jest.fn();
  const sliderProps = {
    onDateChange: mockOnDateChange,
    date: new Date('2023-01-01'),
    predict: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Slider component', () => {
    render(<Slider {...sliderProps} />);
    expect(screen.getByText('1.00x')).toBeInTheDocument();
    expect(screen.getByTestId('date-slider')).toBeInTheDocument();
  });

  test('changes date when slider is moved', () => {
    render(<Slider {...sliderProps} />);
    const slider = screen.getByTestId('date-slider');
    fireEvent.change(slider, { target: { value: '10' } });
    expect(mockOnDateChange).toHaveBeenCalled();
  });

  test('opens calendar when date button is clicked', async () => {
    render(<Slider {...sliderProps} />);
    fireEvent.click(screen.getByText(sliderProps.date.toDateString()));
    await waitFor(() => {
      expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    });
  });

  test('selects date from calendar', async () => {
    render(<Slider {...sliderProps} />);
    fireEvent.click(screen.getByText(sliderProps.date.toDateString()));
    const calendar = await screen.findByTestId('mock-calendar');
    fireEvent.click(within(calendar).getByText('Jan 15'));
    expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
  });

  test('changes playback state when play/pause button is clicked', () => {
    render(<Slider {...sliderProps} />);
    const playButton = screen.getByText('play_arrow');
    fireEvent.click(playButton);
    expect(screen.getByText('pause')).toBeInTheDocument();
  });

  test('increases speed when fast forward button is clicked', () => {
    render(<Slider {...sliderProps} />);
    const fastForwardButton = screen.getByText('fast_forward');
    fireEvent.click(fastForwardButton);
    expect(screen.getByText('1.25x')).toBeInTheDocument();
  });

  test('decreases speed when rewind button is clicked', () => {
    render(<Slider {...sliderProps} />);
    const rewindButton = screen.getByText('fast_rewind');
    fireEvent.click(rewindButton);
    expect(screen.getByText('0.75x')).toBeInTheDocument();
  });

});