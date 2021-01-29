import React from 'react';
import { CloseIcon } from '../Icon';

export const Alert: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="relative py-3 px-4 text-xs text-red-700 bg-red-100 rounded border border-red-400"
    role="alert"
  >
    <strong className="font-bold">Search RSS failed!</strong>
    <span className="block">
      Please check the link and the internet connection.
    </span>
    <span className="absolute top-0 right-0 bottom-0 py-3 px-4">
      <div
        tabIndex={0}
        role="button"
        className="w-4 h-4 text-red-700 cursor-pointer"
        onClick={onClick}
        onKeyDown={onClick}
      >
        <CloseIcon />
      </div>
    </span>
  </div>
);
