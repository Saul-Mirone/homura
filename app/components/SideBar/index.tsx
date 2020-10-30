import React from 'react';

export type SideBarProps = {
  overview: JSX.Element;
  bottom: JSX.Element;
  onClick: () => void;
};

export const SideBar: React.FC<SideBarProps> = ({
  overview,
  bottom,
  children,
  onClick,
}) => {
  return (
    <div
      role="presentation"
      onClick={onClick}
      onKeyDown={onClick}
      className="w-1/6 bg-gray-700 pt-10 flex flex-col h-screen"
    >
      <div className="flex-1 thin-scroll">
        {overview}
        <div className="pt-10" />
        {children}
      </div>
      {bottom}
    </div>
  );
};
