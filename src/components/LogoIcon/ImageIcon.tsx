import React from 'react';

export const ImageIcon: React.FC<{ url: string }> = ({ url }) => (
  <div className="image-icon">
    <div>
      <img alt="icon" src={url} />
    </div>
  </div>
);
