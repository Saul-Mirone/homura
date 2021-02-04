import React from 'react';
import { Preset } from '../../constants/Preset';
import { LogoIcon } from '../LogoIcon';

export type OverViewItemProps = {
    activeId: Preset | number | undefined;
    target: Preset;
    count: number;
    icon: JSX.Element;
    onClick: (target: Preset) => void;
};

export const OverviewItem: React.FC<OverViewItemProps> = ({ activeId, target, icon, count, onClick }) => (
    <div
        role="listitem"
        tabIndex={0}
        className={`${activeId === target ? 'active' : ''} rss-item`}
        onKeyDown={() => onClick(target)}
        onClick={(e) => {
            e.stopPropagation();
            onClick(target);
        }}
    >
        <div className="sidebar-overview-item">
            <LogoIcon icon={icon} />
            <div className="sidebar-overview-item__text">{target}</div>
        </div>
        {count > 0 && <div className="sidebar-overview-item__count">{count}</div>}
    </div>
);
