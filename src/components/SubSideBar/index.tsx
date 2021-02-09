import React from 'react';
import { MailOpenIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';
import { SearchBar } from './SearchBar';
import './style.pcss';

export type Post = {
    id: number;
    name: string;
    source: string;
    icon?: string;
    unread?: boolean;
    active?: boolean;
};

export type SubSideBarProps = {
    header: JSX.Element;
    onReadAll: () => void;
    onSearch: (keywords: string) => void;
    onClick: () => void;
};

export const SubSideBar: React.FC<SubSideBarProps> = ({ header, children, onReadAll, onSearch, onClick }) => (
    <div role="presentation" onClick={onClick} onKeyDown={onClick} className="sub-side-bar__container">
        {header}

        <div role="menu" className="flex-1 thin-scroll">
            {children}
        </div>

        <div className="sub-side-bar__bottom-container">
            <IconContainer label="Mark all as read" onClick={onReadAll}>
                <MailOpenIcon />
            </IconContainer>
            <SearchBar onSearch={onSearch} />
        </div>
    </div>
);
