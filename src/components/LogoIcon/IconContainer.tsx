import React from 'react';

export type IconContainerProps = {
    mini?: boolean;
    className?: string;
    size?: number;
    disabled?: boolean;
    onClick?: () => void;
};

const ButtonDiv: React.FC<Pick<IconContainerProps, 'className' | 'onClick'>> = ({ className, onClick, children }) => (
    <div
        role="button"
        tabIndex={0}
        className={className}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        onKeyDown={onClick}
    >
        {children}
    </div>
);

export const IconContainer: React.FC<IconContainerProps> = ({
    children,
    mini = false,
    size = 5,
    disabled = false,
    className = '',
    onClick,
}) => {
    const disabledClassName = React.useMemo(() => (disabled ? 'cursor-not-allowed' : ''), [disabled]);
    const innerClassName = React.useMemo(() => `w-${size} h-${size} m-auto ${disabledClassName} `, [
        disabledClassName,
        size,
    ]);
    const outerClassName = React.useMemo(
        () => (mini ? `${innerClassName} ${className}` : `p-2 ${disabledClassName} ${className}`),
        [className, disabledClassName, innerClassName, mini],
    );

    const child = React.useMemo(() => (mini ? <>{children}</> : <div className={innerClassName}>{children}</div>), [
        children,
        innerClassName,
        mini,
    ]);

    return (
        <ButtonDiv className={outerClassName} onClick={onClick}>
            {child}
        </ButtonDiv>
    );
};
