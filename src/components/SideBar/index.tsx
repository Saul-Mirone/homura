import React from 'react';
import './style.pcss';

export type SideBarProps = {
    overview: JSX.Element;
    bottom: JSX.Element;
    onClick: () => void;
};

export const SideBar: React.FC<SideBarProps> = ({ overview, bottom, children, onClick }) => (
    <div
        role="menu"
        tabIndex={0}
        aria-label="Sources"
        onClick={onClick}
        onKeyDown={onClick}
        className="sidebar-container"
    >
        <div className="relative flex-1 thin-scroll">
            {overview}
            <div className="pt-10" />
            {children}
        </div>
        {bottom}
    </div>
);
