import React from 'react';

export type IconContainerProps = {
    mini?: boolean;
    label?: string;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
};

const ButtonDiv: React.FC<Pick<IconContainerProps, 'className' | 'onClick' | 'label'>> = ({
    className,
    onClick,
    children,
    label,
}) => (
    <div
        role="button"
        aria-label={label}
        tabIndex={0}
        className={className}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
            e.stopPropagation();
            onClick?.();
        }}
        onKeyDown={onClick}
    >
        {children}
    </div>
);

export const IconContainer: React.FC<IconContainerProps> = ({
    children,
    label = '',
    mini = false,
    disabled = false,
    className = '',
    onClick,
}) => {
    const disabledClassName = React.useMemo(() => (disabled ? 'cursor-not-allowed' : ''), [disabled]);
    const innerClassName = React.useMemo(() => `w-5 h-5 m-auto ${disabledClassName} `, [disabledClassName]);
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
        <ButtonDiv label={label} className={outerClassName} onClick={onClick}>
            {child}
        </ButtonDiv>
    );
};
