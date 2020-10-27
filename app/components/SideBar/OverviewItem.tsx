import React from 'react';
import { Preset } from '../../constants/Preset';
import { SideBarItem } from './SideBarItem';

export type OverViewItemProps = {
  activeId?: Preset | number;
  target: Preset;
  count: number;
  icon: JSX.Element;
  onClick: (target: Preset) => void;
};

export const OverviewItem: React.FC<OverViewItemProps> = ({
  activeId,
  target,
  icon,
  count,
  onClick,
}) => (
  <SideBarItem
    active={activeId === target}
    icon={icon}
    name={target}
    count={count}
    onClick={() => onClick(target)}
  />
);
