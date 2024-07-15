import "./icon.css";

interface ButtonProps {
  icon: String;
  onClick: () => void;
}

const Icon: React.FC<ButtonProps> = ({ icon, onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <i className="material-icons icon" onClick={handleClick}>
      {icon}
    </i>

  );
};

export default Icon;
