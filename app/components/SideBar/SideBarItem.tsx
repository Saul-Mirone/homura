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

export const SideBarItem: React.FC<SideBarItemProps> = (props) => {
  return (
    <div
      className={`${
        props.active ? 'bg-gray-600' : ''
      } leading-8 text-gray-300 flex items-center justify-between cursor-pointer px-3`}
      onClick={props.onClick}
    >
      <div className="flex items-center overflow-x-hidden">
        <LogoIcon {...{ icon: <RssIcon />, ...props }} />
        <div className="text-xs ml-2 truncate">{props.name}</div>
      </div>
      {props.count > 0 && (
        <div className="text-xs text-gray-500">{props.count}</div>
      )}
    </div>
  );
};
