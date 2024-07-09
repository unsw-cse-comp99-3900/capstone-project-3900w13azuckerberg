import React from 'react';
import './map.css';

const Legend = () => {
    return (
        <div className="legend-wrapper">
            <span className="legend-label">Max</span>
            <div className="legend-container"></div>
            <span className="legend-label">0</span>
        </div>
    );
};

export default Legend;