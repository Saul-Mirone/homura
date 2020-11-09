import React from 'react';
import { Preset } from '../../constants/Preset';
import { LogoIcon } from '../LogoIcon';

export type OverViewItemProps = {
  activeId: Preset | number | null;
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
  <div
    role="button"
    tabIndex={0}
    className={`${
      activeId === target ? 'bg-gray-600' : ''
    } leading-8 text-gray-300 flex items-center justify-between cursor-pointer px-3`}
    onKeyDown={() => onClick(target)}
    onClick={(e) => {
      e.stopPropagation();
      onClick(target);
    }}
  >
    <div className="flex items-center overflow-x-hidden">
      <LogoIcon url={null} icon={icon} />
      <div className="text-xs ml-2 truncate">{target}</div>
    </div>
    {count > 0 && <div className="text-xs text-gray-500">{count}</div>}
  </div>
);
