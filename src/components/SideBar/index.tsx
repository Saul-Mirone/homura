import React from 'react';

export type SideBarProps = {
  overview: JSX.Element;
  bottom: JSX.Element;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const SideBar: React.FC<SideBarProps> = ({
  overview,
  bottom,
  children,
  onClick,
}) => {
  return (
    <div
      data-testid="source-side-bar"
      role="presentation"
      onClick={onClick}
      className="flex flex-col w-1/6 h-screen bg-gray-700 select-none"
    >
      <div className="relative flex-1 thin-scroll">
        {overview}
        <div className="pt-10" />
        {children}
      </div>
      {bottom}
    </div>
  );
};
