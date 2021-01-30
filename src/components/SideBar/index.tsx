import React from 'react';
import './style.pcss';

export type SideBarProps = {
    overview: JSX.Element;
    bottom: JSX.Element;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const SideBar: React.FC<SideBarProps> = ({ overview, bottom, children, onClick }) => {
    return (
        <div data-testid="source-side-bar" role="presentation" onClick={onClick} className="sidebar-container">
            <div className="relative flex-1 thin-scroll">
                {overview}
                <div className="pt-10" />
                {children}
            </div>
            {bottom}
        </div>
    );
};
