import React from 'react';
import { PlusIcon, RefreshIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export enum Step {
  EnterUrl,
  EnterName,
}

export type BottomBarProps = {
  step?: Step;
  onClickPlus: () => void;
  render: (step: Step) => JSX.Element;
};

export const BottomBar: React.FC<BottomBarProps> = ({
  step,
  onClickPlus,
  render,
}) => (
  <div className="relative flex justify-between text-gray-300">
    {step !== void 0 && (
      <div className="absolute bottom-0 inset-x-0">{render(step!)}</div>
    )}
    <IconContainer onClick={onClickPlus}>
      <PlusIcon />
    </IconContainer>
    <IconContainer>
      <RefreshIcon />
    </IconContainer>
  </div>
);
