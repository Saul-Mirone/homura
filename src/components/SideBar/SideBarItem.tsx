import { remote } from 'electron';
import React from 'react';
import { CheckCircleFilledIcon, RssIcon } from '../Icon';
import { IconContainerSmall, LogoIcon } from '../LogoIcon';

export type SideBarItemProps = {
  id: number;
  name: string;
  count: number;
  onClick: () => void;
  onUnsubscribe: () => void;
  onConfirmModify: (nextName: string) => void;
  active: boolean;

  url?: string;
  icon?: JSX.Element;
};

export const SideBarItem: React.FC<SideBarItemProps> = ({
  id,
  active,
  onClick,
  onUnsubscribe,
  name,
  count,
  url,
  onConfirmModify,
  icon = <RssIcon />,
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(name);

  React.useEffect(() => {
    const { current } = divRef;

    const listener = (e: MouseEvent) => {
      e.preventDefault();
      const { Menu, MenuItem } = remote;
      const menu = new Menu();
      menu.append(
        new MenuItem({ label: 'unsubscribe', click: () => onUnsubscribe() })
      );
      menu.append(
        new MenuItem({ label: 'edit', click: () => setIsEditing(true) })
      );
      menu.popup();
    };

    current?.addEventListener('contextmenu', listener);

    return () => {
      current?.removeEventListener('contextmenu', listener);
    };
  }, [onUnsubscribe]);

  return (
    <div
      ref={divRef}
      role="button"
      tabIndex={id}
      data-testid={`source-list-item-${id}`}
      className={`${active ? 'active' : ''} rss-item`}
      onKeyDown={onClick}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditing) return;
        onClick();
      }}
    >
      <div className="flex items-center overflow-x-hidden">
        <LogoIcon url={url} icon={icon} />
        {isEditing ? (
          <>
            <input
              data-testid={`source-list-item-${id}:edit-input`}
              className="text-xs text-gray-800 px-2 ml-2 h-5"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={() => {
                setEditedName(name);
                setIsEditing(false);
              }}
            />
            <div className="transition duration-300">
              <IconContainerSmall
                testId={`source-list-item-${id}:edit-button`}
                className="bg-white text-gray-700 hover:text-gray-300 hover:bg-transparent"
                onClick={() => {
                  onConfirmModify(editedName);
                  setIsEditing(false);
                }}
              >
                <CheckCircleFilledIcon />
              </IconContainerSmall>
            </div>
          </>
        ) : (
          <div className="text-xs ml-2 truncate">{name}</div>
        )}
      </div>
      {count > 0 && <div className="text-xs text-gray-500">{count}</div>}
    </div>
  );
};
