import React from 'react';

export const IconContainerSmall: React.FC<{
  size?: number;
  onClick?: () => void;
}> = ({ children, onClick, size = 5 }) => (
  <div
    role="button"
    tabIndex={0}
    className={`w-${size} h-${size} m-auto`}
    onClick={onClick}
    onKeyDown={onClick}
  >
    {children}
  </div>
);

export const IconContainer: React.FC<{
  className?: string;
  onClick?: () => void;
  size?: number;
}> = ({ children, className = '', onClick, size }) => (
  <div
    role="button"
    tabIndex={0}
    className={`p-2 cursor-pointer ${className}`}
    onClick={onClick}
    onKeyDown={onClick}
  >
    <IconContainerSmall size={size}>{children}</IconContainerSmall>
  </div>
);
