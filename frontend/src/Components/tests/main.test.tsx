import { render, fireEvent, waitFor } from '@testing-library/react';
import Main from '../main';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

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
        const { getByText } = render(<Main setIsLoading={() => {}} date={new Date('2021-01-01')} showCompare={false} setShowCompare={() => {}} containerId="M" predict={false} setPredict={setPredict} />);

        // Simulate user action that triggers prediction change
        fireEvent.click(getByText('Toggle Predictions'));
        expect(setPredict).toHaveBeenCalledWith(true);
    });

    // Add more tests as needed
});
