import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BottomBar, Step } from '../../components/SideBar/BottomBar';
import { FeedSearchBar } from '../../components/SideBar/FeedSearchBar';
import { FeedSubscribeBar } from '../../components/SideBar/FeedSubscribeBar';
import { AppDispatch } from '../../store';
import { sync } from '../source/sourceSlice';
import {
  confirmName,
  reset,
  searchUrl,
  selectCreator,
  setParserError,
  stepToEnterUrl,
} from './creatorSlice';

export const Creator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { step, name, refreshing, loading, parseError, link } = useSelector(
    selectCreator
  );

  const renderBottom = React.useCallback(
    (currentStep: Step) => {
      switch (currentStep) {
        case Step.EnterUrl: {
          return (
            <FeedSearchBar
              onClickError={() => dispatch(setParserError(false))}
              hasError={parseError}
              loading={loading}
              onCancel={() => dispatch(reset())}
              onSearch={(inputLink) => dispatch(searchUrl(inputLink))}
            />
          );
        }
        case Step.EnterName: {
          return (
            <FeedSubscribeBar
              link={link}
              initialName={name}
              onCancel={() => dispatch(reset())}
              onConfirm={(inputName) => dispatch(confirmName(inputName))}
            />
          );
        }
        default: {
          throw new Error('Invalid Step');
        }
      }
    },
    [dispatch, link, loading, name, parseError]
  );

  return (
    <BottomBar
      step={step}
      refreshing={refreshing}
      onClickPlus={() => dispatch(stepToEnterUrl())}
      onClickSync={() => dispatch(sync())}
      render={renderBottom}
    />
  );
};
