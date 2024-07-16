import React, { ReactNode } from 'react';
import { Tooltip } from '@mantine/core';

interface CustomTooltipProps {
  label: string;
  children: ReactNode;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, label }) => {
  return (
    <Tooltip
      label={label}
      color="#494949"
      position="top" offset={6}
      withArrow
      transitionProps={{transition:"slide-up", duration:200}}      
      closeDelay={10}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;