import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, RefreshIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export enum Step {
    EnterUrl,
    EnterName,
}

export type BottomBarProps = {
    fold: boolean;
    loading: boolean;
    step: Step | undefined;
    onClickPlus: () => void;
    onClickSync: () => void;
    onToggleFold: () => void;
    render: (step: Step) => JSX.Element;
};

export const BottomBar: React.FC<BottomBarProps> = ({
    fold,
    step,
    onClickPlus,
    onClickSync,
    onToggleFold,
    render,
    loading,
}) => {
    const expanded = (
        <>
            {step !== undefined && <div className="sidebar-bottom-bar__step">{render(step)}</div>}
            <IconContainer label="Fold source menu" onClick={onToggleFold}>
                <ChevronLeftIcon />
            </IconContainer>
            <IconContainer label="Add a source" onClick={onClickPlus}>
                <PlusIcon />
            </IconContainer>
            <IconContainer label="Sync sources" onClick={onClickSync}>
                <RefreshIcon spin={loading} />
            </IconContainer>
        </>
    );
    return (
        <div role="toolbar" className={`sidebar-bottom-bar ${fold ? 'fold' : ''}`}>
            {!fold ? (
                expanded
            ) : (
                <IconContainer label="Unfold source menu" onClick={onToggleFold}>
                    <ChevronRightIcon />
                </IconContainer>
            )}
        </div>
    );
};
