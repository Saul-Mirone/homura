import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toolkit } from '../../components/SubSideBar/ToolKit';
import { AppDispatch } from '../../store';
import { selectMode, switchMode } from './modeSlice';

export const Mode: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector(selectMode);

  return <Toolkit mode={mode} onSwitchMode={(m) => dispatch(switchMode(m))} />;
};
