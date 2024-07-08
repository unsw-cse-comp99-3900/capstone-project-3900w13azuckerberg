import React, { useState } from "react";
import Button from "./filterButton";
import Icon from "./iconButton";
import "./filters.css";

interface FiltersProps {
  token: boolean;
  onFilterChange: (token: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({ token, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const [allFilters, setAllFilters] = useState([
    { label: "Alpha", selected: true },
    { label: "Beta", selected: true },
    { label: "Gamma", selected: true },
    { label: "Delta", selected: true },
    { label: "Omicron", selected: true },
  ]);

  const setAll = (newState: boolean) => {
    setAllFilters(
      allFilters.map((filter) => ({ ...filter, selected: newState })),
    );
    onFilterChange(!token);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleSetSelected = (label: string, newState: boolean) => {
    const updatedFilters = allFilters.map((filter) =>
      filter.label === label ? { ...filter, selected: newState } : filter,
    );
    setAllFilters(updatedFilters);
    console.log(updatedFilters);
    onFilterChange(!token);
  };

  return (
    <div className="filters">
      <img src="logo.png" alt="logo" className="logo" />
      <div className="filter-container">
        <i className="material-icons icon" onClick={toggleFilters}>
          filter_list
        </i>
        <div className={`filter-buttons ${showFilters ? "show" : "hide"}`}>
          {allFilters.map((filter) => (
            <Button
              label={filter.label}
              endpoint="http://127.0.0.1:5000/filter"
              selected={filter.selected}
              onSelect={(selected: boolean) =>
                handleSetSelected(filter.label, selected)
              }
            />
          ))}
          <div className="icon-container">
            <Icon
              icon="filter_none"
              data={{ label: "none" }} 
              endpoint="http://127.0.0.1:5000/filter"
              onClick={() => setAll(false)}
            />
            <Icon
              icon="select_all"
              data={{ label: "all" }} 
              endpoint="http://127.0.0.1:5000/filter"
              onClick={() => setAll(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
