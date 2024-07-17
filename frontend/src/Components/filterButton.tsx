import React from "react";
import "./button.css";
import axios from "axios";

interface ButtonProps {
  label: string;
  endpoint: string;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  containerId: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  endpoint,
  selected,
  onSelect,
  containerId,
}) => {
  const handleClick = async () => {
    try {
      onSelect(!selected);
      const response = await axios.get(endpoint, {
        params: {
          label, // Strain ie Alpha, Beta
          selected, // True or false
          containerId, // M left or right
        }
      });

      console.log("%: filter updated %s %s", response, label, selected);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button
      className={`button ${selected ? "selected" : ""}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default Button;
