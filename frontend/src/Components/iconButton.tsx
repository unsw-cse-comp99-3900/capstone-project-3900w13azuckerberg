import "./icon.css";
import axios from "axios";

interface ButtonProps {
  icon: string;
  data: object;
  endpoint: string;
  onClick: () => void;
}

const Icon: React.FC<ButtonProps> = ({ icon, data, endpoint, onClick }) => {
  const handleClick = async () => {
    try {
      onClick();


      const response = await axios.get(endpoint, {
        params: data,
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
