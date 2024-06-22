import React, { useState } from 'react';
import Button from './button';
import Icon from './icon';
import './filters.css';
import './icon.css'

const Filters = () => {
    const [showFilters, setShowFilters] = useState(false);
    
    const buttons = [
        { label: "Alpha", selected: false },
        { label: "Beta", selected: false },
        { label: "Gamma", selected: false },
        { label: "Delta", selected: false },
        { label: "Omicron", selected: false },
    ];
    const [allFilters, setAllFilters] = useState(buttons);

    const setAll = (newState: boolean) => {
        const updated = allFilters.map(button => ({...button, selected: newState}));
        setAllFilters(updated);
};

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleSetSelected = (label: string, newState: boolean) => {
        const updated = buttons.map(button =>
            button.label === label ? { ...button, selected: newState } : {...button}
        );
        setAllFilters(updated);
    };

    return (
        <div className="filters">
            <img src="logo.png" alt="logo" className="logo" />
            <div className="filter-container">
                <i className="material-icons icon" onClick={toggleFilters}>filter_list</i>
                <div className={`filter-buttons ${showFilters ? 'show' : 'hide'}`}>
                    {allFilters.map((button, index) => (
                        <Button 
                            label={button.label} 
                            endpoint="/filter/new" 
                            selected={button.selected}
                            onSelect={(selected: boolean) => handleSetSelected(button.label, selected)}
                    />))}
                    <div className="icon-container">
                        <Icon icon="filter_none" data={false} endpoint="/filter/new" onClick={() => setAll(false)}/>
                        <Icon icon="select_all" data={true} endpoint="/filter/new" onClick={() => setAll(true)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
