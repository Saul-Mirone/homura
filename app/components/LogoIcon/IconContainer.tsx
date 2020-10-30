import React from 'react';

export const IconContainerSmall: React.FC<{
  size?: number;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, onClick, size = 5, disabled = false }) => (
  <div
    role="button"
    tabIndex={0}
    className={`w-${size} h-${size} m-auto ${
      disabled ? 'cursor-not-allowed' : ''
    }`}
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
  disabled?: boolean;
}> = ({ children, className = '', onClick, size, disabled }) => (
  <div
    role="button"
    tabIndex={0}
    className={`p-2 ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick?.();
    }}
    onKeyDown={onClick}
  >
    <IconContainerSmall disabled={disabled} size={size}>
      {children}
    </IconContainerSmall>
  </div>
);
