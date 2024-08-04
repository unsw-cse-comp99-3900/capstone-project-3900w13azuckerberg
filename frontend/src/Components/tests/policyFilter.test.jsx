import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import axios from 'axios';
import PolicyFilters from '../policyFilters';

jest.mock('../customTooltip', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('react-calendar', () => {
  return function DummyCalendar(props) {
    return (
      <div data-testid="mock-calendar">
       <button onClick={() => props.onClickDay(new Date(2023, 0, 15))}>start</button>
       <button onClick={() => props.onClickDay(new Date(2023, 0, 20))}>end</button>
      </div>
    );
  };
});

jest.mock('axios');
const mockedAxios = axios;

describe('PolicyFilters', () => {
  const policyProps = {
    token: false,
    onFilterChange: jest.fn(),
    containerId: "container1",
    policies: {},
    setPolicies: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default initial states', () => {
    render(<PolicyFilters {...policyProps} />);
    // check all elements are there
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  test('updates the dates and closes the calendar', async () => {
    const { getByText, queryByText } = render(<PolicyFilters {...policyProps} />);
      
    fireEvent.click(screen.getByText('Start Date'));
    const startCalendar = await screen.findByTestId('mock-calendar');
    fireEvent.click(within(startCalendar).getByText('start'));
    
    fireEvent.click(screen.getByText('End Date'));
    const endCalendar = await screen.findByTestId('mock-calendar');
    fireEvent.click(within(endCalendar).getByText('end'));

    expect(screen.getByText('2023-01-15')).toBeInTheDocument(); // Start Date
    expect(screen.getByText('2023-01-20')).toBeInTheDocument(); // End Date
    });
    
  test('fetches policies correctly on apply', async () => {

    const { getByText, getByRole } = render(<PolicyFilters {...policyProps} />);
    
    // Select start date
    fireEvent.click(screen.getByText('Start Date'));
    const startCalendar = await screen.findByTestId('mock-calendar');
    fireEvent.click(within(startCalendar).getByText('start'));
    
    // Select end date
    fireEvent.click(screen.getByText('End Date'));
    const endCalendar = await screen.findByTestId('mock-calendar');
    fireEvent.click(within(endCalendar).getByText('end'));


    fireEvent.change(screen.getByRole('combobox', { name: /state/i }), { target: { value: 'New South Wales' } });
    fireEvent.change(screen.getByRole('combobox', { name: /policy/i }), { target: { value: 'Lockdown' } });

    await waitFor(() => {
      expect(screen.getByText('Apply')).not.toBeDisabled();
    });

    mockedAxios.get.mockResolvedValue({ data: {} });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(policyProps.onFilterChange).toHaveBeenCalled();
      expect(policyProps.setPolicies).toHaveBeenCalled();

      expect(screen.getByText("Start Date")).toBeInTheDocument();
      expect(screen.getByText("End Date")).toBeInTheDocument();
      expect(screen.getByText("State")).toBeInTheDocument();
      expect(screen.getByText("Policy")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();

    });
  });
});
