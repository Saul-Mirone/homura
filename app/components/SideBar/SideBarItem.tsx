import React from 'react';
import { RssIcon } from '../Icon';
import { LogoIcon } from '../LogoIcon';

export type SideBarItemProps = {
  name: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
  url?: string;
  icon?: JSX.Element;
};

export const SideBarItem: React.FC<SideBarItemProps> = ({
  active,
  onClick,
  name,
  count,
  url,
  icon = <RssIcon />,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${
        active ? 'bg-gray-600' : ''
      } leading-8 text-gray-300 flex items-center justify-between cursor-pointer px-3`}
      onKeyDown={onClick}
      onClick={onClick}
    >
      <div className="flex items-center overflow-x-hidden">
        <LogoIcon url={url} icon={icon} />
        <div className="text-xs ml-2 truncate">{name}</div>
      </div>
      {count > 0 && <div className="text-xs text-gray-500">{count}</div>}
    </div>
  );
};
