import React from 'react';
import { Mode } from '../../constants/Mode';
import { MailFilledIcon, StarFilledIcon, ViewListFilledIcon } from '../Icon';
import { IconContainer } from '../LogoIcon';

export type ToolKitProps = {
  mode: Mode;
  onSwitchMode: (nextMode: Mode) => void;
};

const ToolkitItem: React.FC<
  ToolKitProps & { target: Mode; icon: JSX.Element }
> = ({ mode, onSwitchMode, target, icon }) => (
  <IconContainer
    className={`py-1 ${mode === target ? 'bg-gray-300 text-gray-800' : ''}`}
    size={4}
    onClick={() => onSwitchMode(target)}
  >
    {icon}
  </IconContainer>
);

export const Toolkit: React.FC<ToolKitProps> = ({ mode, onSwitchMode }) => (
  <div className="flex justify-end">
    <div className="inline-flex my-1 mr-1 text-gray-300 rounded border border-gray-300 divide-x">
      <ToolkitItem
        mode={mode}
        onSwitchMode={onSwitchMode}
        target={Mode.Starred}
        icon={<StarFilledIcon />}
      />
      <ToolkitItem
        mode={mode}
        onSwitchMode={onSwitchMode}
        target={Mode.Unread}
        icon={<MailFilledIcon />}
      />
      <ToolkitItem
        mode={mode}
        onSwitchMode={onSwitchMode}
        target={Mode.All}
        icon={<ViewListFilledIcon />}
      />
    </div>
  </div>
);
