import React from 'react';

export const Container: React.FC = ({ children }) => (
  <div className="flex w-full h-full min-h-screen bg-gray-800 divide-x divide-gray-900 divide-opacity-50">
    {children}
  </div>
);
