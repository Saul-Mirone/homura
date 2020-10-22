import React from 'react';
import { MailOpenIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';
import { SearchBar } from './SearchBar';

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
};

export const SubSideBar: React.FC<SubSideBarProps> = ({ header, children }) => (
  <div className="w-1/6 flex flex-col h-screen">
    {header}

    <div className="flex-1 thin-scroll">{children}</div>

    <div className="flex justify-between text-gray-300">
      <IconContainer>
        <MailOpenIcon />
      </IconContainer>
      <SearchBar />
    </div>
  </div>
);
