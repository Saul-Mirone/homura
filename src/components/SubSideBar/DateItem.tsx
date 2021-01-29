import React from 'react';

export type DateItemProps = {
  date: string;
};

export const DateItem: React.FC<DateItemProps> = ({ date, children }) => (
  <div className="mb-4">
    <div className="py-2 pl-8 text-xs text-gray-300 uppercase">{date}</div>
    {children}
  </div>
);
