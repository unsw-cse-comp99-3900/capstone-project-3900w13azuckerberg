import "./icon.css";
import axios from "axios";

interface ButtonProps {
  icon: string;
  data: string;
  endpoint: string;
  onClick: () => void;
  containerId: string;
}

const Icon: React.FC<ButtonProps> = ({ icon, data, endpoint, onClick, containerId }) => {
  const handleClick = async () => {
    try {
      onClick();


      const response = await axios.get(endpoint, {
        params: {
          param1: data, // All or none
          param2: false,
          param3: containerId, // M left or right
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
