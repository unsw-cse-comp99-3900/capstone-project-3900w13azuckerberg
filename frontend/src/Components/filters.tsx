import React, { useState } from "react";
import Button from "./filterButton";
import Icon from "./iconButton";
import "./filters.css";
import CustomTooltip from './customTooltip';

interface FiltersProps {
  token: boolean;
  onFilterChange: (token: boolean) => void;
  setShowCompare: (token: boolean) => void;
  showCompare: boolean;
  predict: boolean;
	setPredict: (predict: boolean) => void;
  containerId: string;
}

const Filters: React.FC<FiltersProps> = ({ 
    token, 
    onFilterChange, 
    setShowCompare, 
    showCompare, 
    predict, 
    setPredict,
    containerId
  }) => {
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
  
  const handleCompare = () => {
    setShowCompare(!showCompare);
    setPredict(false);
  }

  const handlePredict = () => {
    setPredict(!predict);
    setShowCompare(false);
    onFilterChange(!token);
  }

  return (
    <div className="filters">
      <div className="filter-container">
        <CustomTooltip label="Filter by Strain">
          <i className="material-icons icon" onClick={toggleFilters}>
            filter_list
          </i>
        </CustomTooltip>
        <div className={`filter-buttons ${showFilters ? "show" : "hide"}`}>
          <button className={`compare-button ${!showCompare ? "" : "selected"}`} onClick={handleCompare}>
            Compare
          </button>
          <button className={`compare-button ${!predict ? "" : "selected"}`} onClick={handlePredict}>
            Predict
          </button>
          <div className={`filter-buttons ${predict ? "hide" : "show"}`}>
            {allFilters.map((filter) => (
              <Button
                label={filter.label}
                endpoint="http://127.0.0.1:5000/filter"
                selected={filter.selected}
                onSelect={(selected: boolean) =>
                  handleSetSelected(filter.label, selected)
                }
                containerId={containerId}
              />
            ))}
            <div className="icon-container">
              <CustomTooltip label="Select None">
                <div>
                  <Icon
                    icon="filter_none"
                    data={"none"} 
                    endpoint="http://127.0.0.1:5000/filter"
                    onClick={() => setAll(false)}
                    containerId={containerId}
                  />
                </div>
              </CustomTooltip>
              <CustomTooltip label="Select All">
                <div>
                  <Icon
                    icon="select_all"
                    data={"all"} 
                    endpoint="http://127.0.0.1:5000/filter"
                    onClick={() => setAll(true)}
                    containerId={containerId}
                  />
                </div>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
