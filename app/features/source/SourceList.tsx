import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SideBar } from '../../components/SideBar';
import { Header } from '../../components/SideBar/Header';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { AppDispatch } from '../../store';
import {
  fetchSources,
  selectSourceList,
  setCurrentSource,
  unsubscribeById,
  updateSourceById,
} from './sourceSlice';

export const SourceList: React.FC<{ bottom: JSX.Element }> = ({ bottom }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeId, mode, totalCount } = useSelector(selectSourceList);

  React.useEffect(() => {
    dispatch(fetchSources(mode));
  }, [dispatch, mode]);

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
      onClick={() => dispatch(setCurrentSource(null))}
      overview={overview}
      bottom={bottom}
    >
      {list.map(({ id, name, count, icon }) => (
        <SideBarItem
          onConfirmModify={(nextName) => {
            dispatch(updateSourceById({ id, name: nextName }));
          }}
          onUnsubscribe={() => {
            dispatch(unsubscribeById(id));
          }}
          key={id.toString()}
          url={icon}
          name={name}
          count={count}
          active={id === activeId}
          onClick={() => dispatch(setCurrentSource(id))}
        />
      ))}
    </SideBar>
  );
};
