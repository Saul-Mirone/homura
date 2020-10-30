import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SideBar } from '../../components/SideBar';
import { Header } from '../../components/SideBar/Header';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { AppDispatch } from '../../store';
import { loadSource, selectSource, setActiveId } from './sourceSlice';

export const Source: React.FC<{ bottom: JSX.Element }> = ({ bottom }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeId, mode, totalCount } = useSelector(selectSource);

  React.useEffect(() => {
    dispatch(loadSource(mode));
  }, [dispatch, mode]);

  const overview = (
    <Header
      mode={mode}
      active={activeId}
      count={totalCount}
      onClick={(id) => dispatch(setActiveId(id))}
    />
  );

  return (
    <SideBar
      onClick={() => {
        if (!activeId) return;
        dispatch(setActiveId());
      }}
      overview={overview}
      bottom={bottom}
    >
      {list.map(({ id, name, count, icon = undefined }) => (
        <SideBarItem
          enableContextMenu
          onUnsubscribe={() => console.log(id)}
          key={id.toString()}
          url={icon}
          name={name}
          count={count}
          active={id === activeId}
          onClick={() => dispatch(setActiveId(id))}
        />
      ))}
    </SideBar>
  );
};
