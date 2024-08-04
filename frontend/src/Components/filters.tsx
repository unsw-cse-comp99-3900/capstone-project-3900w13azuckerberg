import React, { useState } from "react";
import Button from "./filterButton";
import Icon from "./iconButton";
import "./filters.css";
import CustomTooltip from './customTooltip';
import { arrayToCSV, downloadFile } from './export'
import { MapData, PolicyData } from "./types"
import PolicyFilters from "./policyFilters";


interface FiltersProps {
  token: boolean;
  onFilterChange: (token: boolean) => void;
  setShowCompare: (token: boolean) => void;
  showCompare: boolean;
  predict: boolean;
	setPredict: (predict: boolean) => void;
  containerId: string;
  allMapData: MapData;
  policies: PolicyData;
  setPolicies: (policies: PolicyData) => void;
}

const Filters: React.FC<FiltersProps> = ({ 
    token, 
    onFilterChange, 
    setShowCompare, 
    showCompare, 
    predict, 
    setPredict,
    containerId,
    allMapData,
    policies,
    setPolicies
  }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false); 
  const [allFilters, setAllFilters] = useState([
    { label: "Alpha", selected: true },
    { label: "Beta", selected: true },
    { label: "Delta", selected: true },
    { label: "Gamma", selected: true },
    { label: "Omicron", selected: true },
  ]);
  const [filterIcon, setFilterIcon] = useState<string>("filter_list");
  const [policyFilters, setPolicyFilters] = useState(false);

  // sets all filters to a certain state
  const setAll = (newState: boolean) => {
    setAllFilters(
      allFilters.map((filter) => ({ ...filter, selected: newState })),
    );
    onFilterChange(!token);
  };

  // opens the correct menu option depending on historical or predict
  const toggleFilters = () => {
    if (!predict) {
      setShowFilters((prev) => !prev);
    } else {
      setPolicyFilters((prev) => !prev);
    }
  };

  // opens/closes the menu on click
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // updates only 1 of the selected filters
  const handleSetSelected = (label: string, newState: boolean) => {
    const updatedFilters = allFilters.map((filter) =>
      filter.label === label ? { ...filter, selected: newState } : filter,
    );
    setAllFilters(updatedFilters);
    console.log(updatedFilters);
    onFilterChange(!token);
  };
  
  // toggles compare mode
  const handleCompare = () => {
    setShowCompare(!showCompare);
    // setPredict(false);
  }

  // toggles compare mode
  const handlePredict = () => {
    setFilterIcon(predict ? "filter_list" : "add");
    setPredict(!predict);
    setShowFilters(false);
    setPolicyFilters(false);

    // setShowCompare(false);
    onFilterChange(!token);
  }

  // handles exporting of data and calculates meaningful file name
  const handleExport = () => {
    const data = arrayToCSV(allMapData);

    let filename: string;
    if (predict) {
      if (Object.keys(policies).length === 0) {
        filename = "predictive_model.csv";
      } else {
        let states = ""; 
        for (const [state, info] of Object.entries(policies)) {
          states += `${state}_${info.policy}_`;
        }
        filename = `${states}predictive.csv`;
      }
    } else if (allFilters.every(filter => filter.selected)) {
      filename = "all_variants_data.csv";
    } else {
      const selectedFilters = allFilters
        .filter(filter => filter.selected)
        .map(filter => filter.label)
        .join('_');
  
      filename = `${selectedFilters}_data.csv`;
    }

    downloadFile(data, filename, 'text/csv');
  }

  return (
    <div className="filters">
      <div className="filter-container">
        <CustomTooltip label="Menu Options">
          <i className="material-icons icon square" onClick={toggleMenu}>
            menu
          </i>
        </CustomTooltip>
        <div className={`filter-buttons ${showMenu ? "show" : "hide"}`}>
          <CustomTooltip label={predict ? "Export Current Policies" : "Export Currently Selected Strains"}>
            <button className={`button`} onClick={handleExport}>
              Export
            </button>
          </CustomTooltip>
          <CustomTooltip label={showCompare ? "Return to Single View" : "Compare Cases"}>
            <button className={`button ${!showCompare ? "" : "selected"}`} data-testid="compare-button"  onClick={handleCompare}>
              Compare
            </button>
          </CustomTooltip>
          <CustomTooltip label={predict ? "Return to Historic Data" : "Model Future Cases"}>
            <button className={`button ${!predict ? "" : "selected"}`} data-testid="predict-button" onClick={handlePredict}>
              Predict
            </button>
          </CustomTooltip>
          <CustomTooltip label={predict ? "Add Government Policy" : "Filter by Strain"}>
            <i className="material-icons icon square" onClick={toggleFilters}>
              {filterIcon}
            </i>
          </CustomTooltip>
          <div className={`filter-buttons ${policyFilters ? "show" : "hide"}`}>
            <PolicyFilters 
              token={token} 
              onFilterChange={onFilterChange} 
              containerId={containerId} 
              policies={policies}
              setPolicies={setPolicies}
            />
          </div>
          <div className={`filter-buttons ${showFilters ? "show" : "hide"}`}>
            {allFilters.map((filter) => (
              <Button
                label={filter.label}
                endpoint="http://127.0.0.1:5001/filter"
                selected={filter.selected}
                onSelect={() => handleSetSelected(filter.label, !filter.selected)}
                containerId={containerId}
              />
            ))}
            <div className="icon-container">
              <CustomTooltip label="Select None">
                <div>
                  <Icon
                    icon="filter_none"
                    data={"none"} 
                    endpoint="http://127.0.0.1:5001/filter"
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
                    endpoint="http://127.0.0.1:5001/filter"
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
