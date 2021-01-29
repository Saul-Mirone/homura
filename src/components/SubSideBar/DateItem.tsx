import React from 'react';

export type DateItemProps = {
  date: string;
};

export const DateItem: React.FC<DateItemProps> = ({ date, children }) => (
  <div className="mb-4">
    <div className="sub-side-bar__date-item">{date}</div>
    {children}
  </div>
);
