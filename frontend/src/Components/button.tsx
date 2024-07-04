import React from "react";
import "./button.css";
import axios from "axios";

interface ButtonProps {
  label: string;
  endpoint: string;
  selected: boolean;
  onSelect: (selected: boolean) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  endpoint,
  selected,
  onSelect,
}) => {
  const handleClick = async () => {
    try {
      onSelect(!selected);
      console.log("hello");

      const newData = { label: label, selected: !selected };

      const response = await axios.get(endpoint, {
        params: newData,
      });

      console.log("Success:", response.data);
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
