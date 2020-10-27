import React from 'react';

export const Container: React.FC = ({ children }) => (
  <div className="bg-gray-800 w-full h-full min-h-screen flex divide-x divide-gray-900 divide-opacity-50">
    {children}
  </div>
);
