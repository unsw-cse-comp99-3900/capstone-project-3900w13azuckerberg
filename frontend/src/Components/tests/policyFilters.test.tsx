import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import PolicyFilters from '../policyFilters';
import mRender from './testhelper';

describe('PolicyFilters Initial State', () => {
  it('mRenders with default initial states', () => {
    mRender(<PolicyFilters token={false} onFilterChange={jest.fn()} containerId="container1" policies={{}} setPolicies={jest.fn()} />);
    // check all elements are there
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });
});

describe('Date Selection Functionality', () => {
  it('updates the start date and closes the calendar', () => {
    const { getByText, queryByText } = mRender(<PolicyFilters token={false} onFilterChange={jest.fn()} containerId="container1" policies={{}} setPolicies={jest.fn()} />);
    // Open calendar
    fireEvent.click(getByText('Start Date'));
    // Click on date 15 of the current displayed month 
    fireEvent.click(getByText('15')); 
    // Check if the date is updated
    expect(getByText('15')).toBeInTheDocument(); 
    // Calendar should be closed
    expect(queryByText('react-calendar')).not.toBeInTheDocument(); 
  });
});

describe('API Interaction', () => {
  it('fetches policies correctly on apply', async () => {
    const mock = new MockAdapter(axios);
    const responseData = { data: 'someData' };
    mock.onGet("http://127.0.0.1:5001/policies").reply(200, responseData);

    const setPolicies = jest.fn();
    const { getByText, getByRole } = mRender(<PolicyFilters token={false} onFilterChange={jest.fn()} containerId="container1" policies={{}} setPolicies={jest.fn()} />);
    fireEvent.click(getByText('Start Date')); 
    fireEvent.click(getByText('15'));
    fireEvent.click(getByText('End Date'));
    fireEvent.click(getByText('20')); 
    fireEvent.change(screen.getByRole('combobox', { name: 'State' }), { target: { value: 'New South Wales' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Policy' }), { target: { value: 'Lockdown' } });
    expect(getByRole('button', { name: 'Apply' })).toBeEnabled();
    fireEvent.click(getByText('Apply'));
    await waitFor(() => {
      expect(setPolicies).toHaveBeenCalledWith(expect.anything());
    });
  });
});

