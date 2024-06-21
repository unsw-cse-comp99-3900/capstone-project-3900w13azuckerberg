import React, { useState } from 'react';
import './button.css';


interface ButtonProps {
    label: string;
    data: any;
    endpoint: string;
    icon?: string;
}

const Button: React.FC<ButtonProps> = ({ label, data, endpoint, icon }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = async () => {
        try {
            const newSelectedState: boolean = !isSelected;
            setIsSelected(newSelectedState);

            const newData = {...data, selected: newSelectedState};

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
        <button className={`button ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
            {icon && <i className="material-icons">{icon}</i>}
            {label}
        </button>
    );
};

export default Button;