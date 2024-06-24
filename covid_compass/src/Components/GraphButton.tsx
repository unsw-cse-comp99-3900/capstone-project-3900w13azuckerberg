import React from 'react';
import { ActionIcon} from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import './GraphButton.css';
import { IconAdjustments } from '@tabler/icons-react';

interface BarGraphButtonProps {
  onClick: () => void;
}

const GraphButton: React.FC<BarGraphButtonProps> = ({ onClick }) => {
  return (
    <div id='main'>
        <ActionIcon className="bar-graph-btn" variant="transparent" color="rgba(217, 217, 217, 1)" size="xl" onClick={onClick}>
            <IconChartBar size={48}/>
        </ActionIcon>
    </div>
  );
};

export default GraphButton;
