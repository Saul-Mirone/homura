import React from 'react';
import { Preset } from '../../constants/Preset';
import { LogoIcon } from '../LogoIcon';

export type OverViewItemProps = {
  testId?: string;
  activeId: Preset | number | undefined;
  target: Preset;
  count: number;
  icon: JSX.Element;
  onClick: (target: Preset) => void;
};

export const OverviewItem: React.FC<OverViewItemProps> = ({
  testId,
  activeId,
  target,
  icon,
  count,
  onClick,
}) => (
  <div
    role="button"
    data-testid={testId}
    tabIndex={0}
    className={`${activeId === target ? 'active' : ''} rss-item`}
    onKeyDown={() => onClick(target)}
    onClick={(e) => {
      e.stopPropagation();
      onClick(target);
    }}
  >
    <div className="flex overflow-x-hidden items-center">
      <LogoIcon icon={icon} />
      <div className="ml-2 text-xs truncate">{target}</div>
    </div>
    {count > 0 && <div className="text-xs text-gray-500">{count}</div>}
  </div>
);
