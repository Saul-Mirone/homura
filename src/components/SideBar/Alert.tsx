import React from 'react';
import { CloseIcon } from '../Icon';

export const Alert: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="sidebar-alert" role="alert">
    <strong>Search RSS failed!</strong>
    <span className="block">
      Please check the link and the internet connection.
    </span>
    <span className="sidebar-alert__logo">
      <div tabIndex={0} role="button" onClick={onClick} onKeyDown={onClick}>
        <CloseIcon />
      </div>
    </span>
  </div>
);
