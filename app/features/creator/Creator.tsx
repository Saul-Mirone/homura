import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BottomBar, Step } from '../../components/SideBar/BottomBar';
import { FeedSearchBar } from '../../components/SideBar/FeedSearchBar';
import { FeedSubscribeBar } from '../../components/SideBar/FeedSubscribeBar';
import { AppDispatch } from '../../store';
import {
  confirmName,
  searchUrl,
  selectCreator,
  setLink,
  setName,
  stepToEnterUrl,
} from './creatorSlice';

export const Creator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { step, link, name } = useSelector(selectCreator);

  const renderBottom = React.useCallback(
    (currentStep: Step) =>
      currentStep === Step.EnterUrl ? (
        <FeedSearchBar
          link={link}
          onLinkChange={(x) => dispatch(setLink(x))}
          onSearch={() => dispatch(searchUrl())}
        />
      ) : (
        <FeedSubscribeBar
          link={link}
          name={name}
          onNameChange={(x) => dispatch(setName(x))}
          onConfirm={() => dispatch(confirmName())}
        />
      ),
    [dispatch, link, name]
  );

  return (
    <BottomBar
      step={step}
      onClickPlus={() => dispatch(stepToEnterUrl())}
      render={renderBottom}
    />
  );
};
