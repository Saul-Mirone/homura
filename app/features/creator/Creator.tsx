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
  setLink,
  setName,
  stepToEnterUrl,
} from './creatorSlice';

export const Creator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { step, link, name, refreshing, loading } = useSelector(selectCreator);

  const renderBottom = React.useCallback(
    (currentStep: Step) =>
      currentStep === Step.EnterUrl ? (
        <FeedSearchBar
          loading={loading}
          link={link}
          onCancel={() => dispatch(reset())}
          onLinkChange={(x) => dispatch(setLink(x))}
          onSearch={() => dispatch(searchUrl())}
        />
      ) : (
        <FeedSubscribeBar
          link={link}
          name={name}
          onCancel={() => dispatch(reset())}
          onNameChange={(x) => dispatch(setName(x))}
          onConfirm={() => dispatch(confirmName())}
        />
      ),
    [dispatch, link, loading, name]
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
