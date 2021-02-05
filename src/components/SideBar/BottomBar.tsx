import React from 'react';
import { PlusIcon, RefreshIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export enum Step {
    EnterUrl,
    EnterName,
}

export type BottomBarProps = {
    step: Step | undefined;
    onClickPlus: () => void;
    onClickSync: () => void;
    render: (step: Step) => JSX.Element;
    loading: boolean;
};

export const BottomBar: React.FC<BottomBarProps> = ({ step, onClickPlus, onClickSync, render, loading }) => (
    <div role="toolbar" className="sidebar-bottom-bar">
        {step !== undefined && <div className="sidebar-bottom-bar__step">{render(step)}</div>}
        <IconContainer label="Add a source" onClick={onClickPlus}>
            <PlusIcon />
        </IconContainer>
        <IconContainer label="Sync sources" onClick={onClickSync}>
            <RefreshIcon spin={loading} />
        </IconContainer>
    </div>
);
