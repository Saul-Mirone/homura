import React from 'react';

export const ImageIcon: React.FC<{ url: string }> = ({ url }) => (
  <div className="w-6 h-6 flex justify-center items-center bg-white rounded flex-shrink-0">
    <div className="w-4 h-4">
      <img className="object-cover w-full h-full" alt="icon" src={url} />
    </div>
  </div>
);
