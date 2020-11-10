import React from 'react';
import { PlusIcon, RefreshIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export enum Step {
  EnterUrl,
  EnterName,
}

export type BottomBarProps = {
  step: Step | null;
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
  <div className="relative flex justify-between text-gray-300">
    {step !== null && (
      <div className="absolute bottom-0 inset-x-0 z-10">{render(step)}</div>
    )}
    <IconContainer onClick={onClickPlus}>
      <PlusIcon />
    </IconContainer>
    <IconContainer onClick={onClickSync}>
      <RefreshIcon spin={loading} />
    </IconContainer>
  </div>
);
