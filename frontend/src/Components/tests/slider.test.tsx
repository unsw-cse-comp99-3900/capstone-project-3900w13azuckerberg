import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { screen, fireEvent  } from '@testing-library/react';
import Slider from '../slider';
import mRender from './testhelper';

describe('Slider Component', () => {
  it('mRenders correctly with initial props', () => {
    mRender(<Slider date={new Date('2024-05-30')} onDateChange={jest.fn()} predict={false} />);
    expect(screen.getByText('2024-05-30')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Date')).toBeInTheDocument();
  });

  it('handles date selection correctly', () => {
      const handleDateChange = jest.fn();
      const { getByText, getByRole } = mRender(<Slider date={new Date('2024-05-30')} onDateChange={handleDateChange} predict={false} />);
      
      fireEvent.click(getByText('2024-05-30'));
      fireEvent.click(getByText('15'));
      
      expect(handleDateChange).toHaveBeenCalledWith(new Date('2024-05-15'));
    });
  
  it('toggles playback correctly', () => {
  const { getByLabelText } = mRender(<Slider date={new Date('2024-05-30')} onDateChange={jest.fn()} predict={false} />);
  fireEvent.click(getByLabelText('Play'));
  expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });
  
  it('changes speed correctly', () => {
  const { getByText, getByLabelText } = mRender(<Slider date={new Date('2024-05-30')} onDateChange={jest.fn()} predict={false} />);
  fireEvent.click(getByLabelText('Increase Speed'));
  expect(getByText('1.25x')).toBeInTheDocument();
  });
});

