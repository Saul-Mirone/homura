import React from 'react';
import { CloseIcon } from '../Icon';

export const Alert: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="text-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong className="font-bold">Search RSS failed!</strong>
    <span className="block">
      Please check the link and the internet connection.
    </span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
      <div
        tabIndex={0}
        role="button"
        className="h-4 w-4 text-red-700 cursor-pointer"
        onClick={onClick}
        onKeyDown={onClick}
      >
        <CloseIcon />
      </div>
    </span>
  </div>
);
