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

export const BottomBar: React.FC<BottomBarProps> = ({
  step,
  onClickPlus,
  onClickSync,
  render,
  loading,
}) => (
  <div role="toolbar" className="flex relative justify-between text-gray-300">
    {step !== undefined && (
      <div className="absolute inset-x-0 bottom-0 z-10">{render(step)}</div>
    )}
    <IconContainer onClick={onClickPlus}>
      <PlusIcon />
    </IconContainer>
    <IconContainer onClick={onClickSync}>
      <RefreshIcon spin={loading} />
    </IconContainer>
  </div>
);
