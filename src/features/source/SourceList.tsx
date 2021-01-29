import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SideBar } from '../../components/SideBar';
import { Header } from '../../components/SideBar/Header';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { Status } from '../../constants/Status';
import { AppDispatch } from '../../store';
import {
  fetchSources,
  selectSourceList,
  setCurrentSource,
  syncSources,
  unsubscribeById,
  updateSourceById,
} from './sourceSlice';

export const SourceList: React.FC<{ bottom: JSX.Element }> = ({ bottom }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeId, mode, totalCount, syncStatus } = useSelector(
    selectSourceList
  );

  React.useEffect(() => {
    dispatch(syncSources());
  }, [dispatch]);

  React.useEffect(() => {
    if (syncStatus === Status.Succeeded) {
      dispatch(fetchSources(mode));
    }
  }, [dispatch, mode, syncStatus]);

  const overview = (
    <Header
      mode={mode}
      active={activeId}
      count={totalCount}
      onClick={(id) => dispatch(setCurrentSource(id))}
    />
  );

  return (
    <SideBar
      onClick={() => {
        if (activeId) {
          dispatch(setCurrentSource());
        }
      }}
      overview={overview}
      bottom={bottom}
    >
      {list.map(({ id, name, count, icon }) => (
        <SideBarItem
          key={id.toString()}
          id={id}
          url={icon}
          name={name}
          count={count}
          active={id === activeId}
          onConfirmModify={(nextName) =>
            dispatch(updateSourceById({ id, name: nextName }))
          }
          onUnsubscribe={() => dispatch(unsubscribeById(id))}
          onClick={() => dispatch(setCurrentSource(id))}
        />
      ))}
    </SideBar>
  );
};
