import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Filters from '../filters';

// Mock the CustomTooltip component
jest.mock('../customTooltip', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);

// Mock the PolicyFilters component
jest.mock('../policyFilters', () => () => <div data-testid="policy-filters">Policy Filters</div>);

// Mock the arrayToCSV and downloadFile functions
jest.mock('../export', () => ({
  arrayToCSV: jest.fn(() => 'mocked CSV data'),
  downloadFile: jest.fn(),
}));

describe('Filters Component', () => {
    const filterProps = {
      token: false,
      onFilterChange: jest.fn(),
      setShowCompare: jest.fn(),
      showCompare: false,
      predict: false,
      setPredict: jest.fn(),
      containerId: 'test-container',
      allMapData: {},
      policies: {},
      setPolicies: jest.fn(),
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders Filters component', () => {
      render(<Filters {...filterProps} />);
      expect(screen.getByText('menu')).toBeInTheDocument();
    });
  
    test('toggles menu when menu icon is clicked', () => {
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
  
    test('toggles compare mode when Compare button is clicked', () => {
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      fireEvent.click(screen.getByText('Compare'));
      expect(filterProps.setShowCompare).toHaveBeenCalledWith(true);
    });
  
    test('toggles predict mode when Predict button is clicked', () => {
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      fireEvent.click(screen.getByText('Predict'));
      expect(filterProps.setPredict).toHaveBeenCalledWith(true);
    });
  
    test('shows strain filters when filter icon is clicked in non-predict mode', () => {
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      
      fireEvent.click(screen.getByText('filter_list'));
      expect(screen.getByText('Alpha')).toBeInTheDocument();
    });
    
    test('shows policy filters when filter icon is clicked in predict mode', () => {
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      fireEvent.click(screen.getByText('Predict'));
      fireEvent.click(screen.getByText('add'));
      expect(screen.getByTestId('policy-filters')).toBeInTheDocument();
    });
  
    test('selects and deselects all filters', () => {
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      fireEvent.click(screen.getByText('filter_list'));
      
      // Select all
      fireEvent.click(screen.getByText('select_all'));
      expect(filterProps.onFilterChange).toHaveBeenCalled();
  
      // Deselect all
      fireEvent.click(screen.getByText('filter_none'));
      expect(filterProps.onFilterChange).toHaveBeenCalled();
    });
  
    test('exports data when Export button is clicked', () => {
      const { arrayToCSV, downloadFile } = require('../export');
      render(<Filters {...filterProps} />);
      fireEvent.click(screen.getByText('menu'));
      fireEvent.click(screen.getByText('Export'));
      
      expect(arrayToCSV).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalled();
    });
  });