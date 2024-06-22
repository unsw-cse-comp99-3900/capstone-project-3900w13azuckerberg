import React from 'react';
import './button.css';

interface ButtonProps {
    label: string;
    endpoint: string;
    selected: boolean;
    onSelect: (selected: boolean) => void;
}

const Button: React.FC<ButtonProps> = ({ label, endpoint, selected, onSelect }) => {

    const handleClick = async () => {
        try {
            onSelect(!selected);

            const newData = {label: label, selected: selected};

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
        <button className={`button ${selected ? 'selected' : ''}`} onClick={handleClick}>
            {label}
        </button>
    );
};

export default Button;