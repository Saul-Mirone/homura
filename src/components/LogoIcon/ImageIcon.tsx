import React from 'react';

export const ImageIcon: React.FC<{ url: string }> = ({ url }) => (
  <div className="flex flex-shrink-0 justify-center items-center w-6 h-6 bg-white rounded">
    <div className="w-4 h-4">
      <img className="object-cover w-full h-full" alt="icon" src={url} />
    </div>
  </div>
);
