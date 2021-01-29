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
  name,
  count,
  url,
  onConfirmModify,
  onClick,
  onUnsubscribe,
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

  const interceptClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (isEditing) return;
    onClick();
  };

  const onConfirmEdit = () => {
    onConfirmModify(editedName);
    setIsEditing(false);
  };

  const pureName = React.useMemo(
    () => <div className="ml-2 text-xs truncate">{name}</div>,
    [name]
  );
  const nameEditor = React.useMemo(
    () => (
      <>
        <input
          data-testid={`source-list-item-${id}:edit-input`}
          className="sidebar-item__input"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={() => {
            setEditedName(name);
            setIsEditing(false);
          }}
        />
        <div className="sidebar-item__confirm-container">
          <IconContainerSmall
            testId={`source-list-item-${id}:edit-button`}
            className="sidebar-item__confirm-icon"
            onClick={onConfirmEdit}
          >
            <CheckCircleFilledIcon />
          </IconContainerSmall>
        </div>
      </>
    ),
    [editedName, id, name, onConfirmEdit]
  );

  return (
    <div
      ref={divRef}
      role="button"
      tabIndex={id}
      data-testid={`source-list-item-${id}`}
      className={`${active ? 'active' : ''} rss-item`}
      onKeyDown={onClick}
      onClick={interceptClick}
    >
      <div className="sidebar-item__container">
        <LogoIcon url={url} icon={icon} />
        {isEditing ? nameEditor : pureName}
      </div>
      {count > 0 && <div className="sidebar-item__count">{count}</div>}
    </div>
  );
};
