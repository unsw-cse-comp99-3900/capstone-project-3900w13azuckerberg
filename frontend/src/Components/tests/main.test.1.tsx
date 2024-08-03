import { fireEvent, waitFor } from '@testing-library/react';
import Main from '../main';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import mRender from './testhelper';


describe('Main Component', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
        // Setup default mock responses
        mock.onGet("http://127.0.0.1:5001/map").reply(200, {
            '2021-01-01': [{ latitude: 34.05, longitude: -118.25, intensity: 5 }]
        });
        mock.onGet("http://127.0.0.1:5001/graphdata").reply(200, {
            '2021-01-01': { 'Australia': { Alpha: 10, Beta: 20, Gamma: 30, Delta: 40, Omicron: 50 } }
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('handles state changes for predictions', async () => {
        const setPredict = jest.fn();
        const { getByText } = mRender(<Main setIsLoading={() => {}} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={setPredict} />);

        // Simulate user action that triggers prediction change
        fireEvent.click(getByText('Toggle Predictions'));
        expect(setPredict).toHaveBeenCalledWith(true);
    });

    it('initializes state variables correctly', () => {
        const { container } = mRender(<Main setIsLoading={() => {}} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={() => {}} />);

        expect(container.querySelector('#body')).toBeInTheDocument();
    });

    it('fetches and updates map data correctly', async () => {
        const setIsLoading = jest.fn();
        const { getByText } = mRender(<Main setIsLoading={setIsLoading} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={() => {}} />);

        await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(true));
        await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));
    });

    it('mRenders child components correctly', () => {
        const { getByText } = mRender(<Main setIsLoading={() => {}} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={() => {}} />);

        expect(getByText('GraphBar Component')).toBeInTheDocument();
        expect(getByText('HeatMap Component')).toBeInTheDocument();
        expect(getByText('Filters Component')).toBeInTheDocument();
        expect(getByText('RadiusSlider Component')).toBeInTheDocument();
    });

    it('handles filter changes correctly', async () => {
        const triggerRefetch = jest.fn();
        const { getByText } = mRender(<Main setIsLoading={() => {}} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={() => {}} />);

        fireEvent.click(getByText('Apply Filters'));
        expect(triggerRefetch).toHaveBeenCalled();
    });

    it('handles radius changes correctly', () => {
        const { getByLabelText } = mRender(<Main setIsLoading={() => {}} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={() => {}} />);

        const slider = getByLabelText('Radius Slider') as HTMLInputElement;
        fireEvent.change(slider, { target: { value: 30 } });
        expect(slider.value).toBe('30');
    });
});
