import React, { useState } from 'react';
import Button from './button';
import './filters.css';

const Filters = () => {
    const [showFilters, setShowFilters] = useState(false); 

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="filters">
            <img src="logo.png" alt="logo" className="logo" />
            <div className="filter-container">
                <i className="material-icons icon" onClick={toggleFilters}>filter_list</i>
                <div className={`filter-buttons ${showFilters ? 'show' : 'hide'}`}>
                    <Button label="Alpha" data={"Alpha"} endpoint="/filter/new" />
                    <Button label="Beta" data={"Beta"} endpoint="/filter/new" />
                    <Button label="Delta" data={"Delta"} endpoint="/filter/new" />
                    <Button label="Omicron" data={"Omicron"} endpoint="/filter/new" />
                    <Button label="Gamma" data={"Gamma"} endpoint="/filter/new" />
                    <Button label="" data={"All"} endpoint="/filter/new" icon="select_all" />
                    <Button label="" data={"None"} endpoint="/filter/new" icon="filter_none" />
                </div>
            </div>
        </div>
    );
};

export default Filters;
