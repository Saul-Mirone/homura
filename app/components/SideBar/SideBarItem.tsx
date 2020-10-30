import React from 'react';
import { RssIcon } from '../Icon';
import { LogoIcon } from '../LogoIcon';

const { remote } = require('electron');

export type SideBarItemProps = {
  name: string;
  count: number;
  enableContextMenu?: boolean;
  active?: boolean;
  onClick?: () => void;
  onUnsubscribe?: () => void;
  url?: string;
  icon?: JSX.Element;
};

export const SideBarItem: React.FC<SideBarItemProps> = ({
  active,
  onClick,
  onUnsubscribe,
  name,
  count,
  url,
  enableContextMenu = false,
  icon = <RssIcon />,
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const { current } = divRef;
    if (!current) return;

    if (enableContextMenu) {
      current.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const { Menu, MenuItem } = remote;
        const menu = new Menu();
        menu.append(
          new MenuItem({ label: 'unsubscribe', click: () => onUnsubscribe?.() })
        );
        menu.popup();
      });
    }
  }, []);
  return (
    <div
      ref={divRef}
      role="button"
      tabIndex={0}
      className={`${
        active ? 'bg-gray-600' : ''
      } leading-8 text-gray-300 flex items-center justify-between cursor-pointer px-3`}
      onKeyDown={onClick}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div className="flex items-center overflow-x-hidden">
        <LogoIcon url={url} icon={icon} />
        <div className="text-xs ml-2 truncate">{name}</div>
      </div>
      {count > 0 && <div className="text-xs text-gray-500">{count}</div>}
    </div>
  );
};
