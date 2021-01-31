import { remote } from 'electron';
import React from 'react';
import { CheckCircleFilledIcon, RssIcon } from '../Icon';
import { IconContainer, LogoIcon } from '../LogoIcon';

type NameEditorProps = {
    id: number;
    name: string;
    finishEdit(): void;
    onConfirmModify: (nextName: string) => void;
};

const NameEditor: React.FC<NameEditorProps> = ({ id, name, finishEdit, onConfirmModify }) => {
    const [editedName, setEditedName] = React.useState(name);

    const onConfirmEdit = () => {
        onConfirmModify(editedName);
        finishEdit();
    };

    return (
        <>
            <input
                data-testid={`source-list-item-${id}:edit-input`}
                className="sidebar-item__input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={() => {
                    setEditedName(name);
                    finishEdit();
                }}
            />
            <div className="sidebar-item__confirm-container" data-testid={`source-list-item-${id}:edit-button`}>
                <IconContainer mini className="sidebar-item__confirm-icon" onClick={onConfirmEdit}>
                    <CheckCircleFilledIcon />
                </IconContainer>
            </div>
        </>
    );
};

const PureNameContent: React.FC<{ name: string }> = ({ name }) => <div className="ml-2 text-xs truncate">{name}</div>;

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

    const finishEdit = React.useCallback(() => setIsEditing(false), []);

    React.useEffect(() => {
        const { current } = divRef;

        const listener = (e: MouseEvent) => {
            e.preventDefault();
            const { Menu, MenuItem } = remote;
            const menu = new Menu();
            menu.append(new MenuItem({ label: 'unsubscribe', click: () => onUnsubscribe() }));
            menu.append(new MenuItem({ label: 'edit', click: () => setIsEditing(true) }));
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
                {isEditing ? (
                    <NameEditor id={id} name={name} onConfirmModify={onConfirmModify} finishEdit={finishEdit} />
                ) : (
                    <PureNameContent name={name} />
                )}
            </div>
            {count > 0 && <div className="sidebar-item__count">{count}</div>}
        </div>
    );
};
