import './icon.css';

interface ButtonProps {
    icon: string;
    data: boolean;
    endpoint: string;
    onClick: () => void;
}

const Icon: React.FC<ButtonProps> = ({ icon, data, endpoint, onClick }) => {

    const handleClick = async () => {
        try {
            onClick();

            const newData = {label: data, selected: data};

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <i className="material-icons icon" onClick={handleClick}>{icon}</i>

        // <button className={`button ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
        //     {icon && <i className="material-icons">{icon}</i>}
        // </button>
    );
};

export default Icon;