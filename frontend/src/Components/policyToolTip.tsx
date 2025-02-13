import React, { ReactNode } from 'react';
import { Tooltip } from '@mantine/core';

interface PolicyTooltipProps {
  label: string;
  children: ReactNode;
}

const PolicyTooltip: React.FC<PolicyTooltipProps> = ({ children, label }) => {
  return (
    <Tooltip
      multiline
      label={label}
      color="#494949"
      position="top" offset={6}
      withArrow
      transitionProps={{transition:"slide-up", duration:200}}      
      closeDelay={10}
      w={500}
      zIndex={1800}
    >
      {children}
    </Tooltip>
  );
};

export default PolicyTooltip;