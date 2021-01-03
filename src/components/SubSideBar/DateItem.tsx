import React from 'react';

export type DateItemProps = {
  date: string;
};

export const DateItem: React.FC<DateItemProps> = ({ date, children }) => (
  <div className="mb-4">
    <div className="uppercase text-gray-300 text-xs py-2 pl-8">{date}</div>
    {children}
  </div>
);
