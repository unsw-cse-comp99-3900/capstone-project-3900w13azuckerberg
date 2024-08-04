import "./icon.css";
import axios from "axios";

interface ButtonProps {
  icon: string;
  data: string;
  endpoint: string;
  onClick: () => void;
  containerId: string;
}

// button to query to backend using a icon
const Icon: React.FC<ButtonProps> = ({ icon, data, endpoint, onClick, containerId }) => {
  const handleClick = async () => {
    try {
      onClick();


      const response = await axios.get(endpoint, {
        params: {
          label: data, // All or none
          selected: false,
          containerId: containerId, // M left or right
        }
      });

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <i className="material-icons icon" onClick={handleClick}>
      {icon}
    </i>
  );
};

export default Icon;
