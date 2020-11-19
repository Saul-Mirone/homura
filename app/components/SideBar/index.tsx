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
      data-testid="source-side-bar"
      role="presentation"
      onClick={onClick}
      className="w-1/6 bg-gray-700 flex flex-col h-screen select-none"
    >
      <div className="flex-1 thin-scroll relative">
        {overview}
        <div className="pt-10" />
        {children}
      </div>
      {bottom}
    </div>
  );
};
