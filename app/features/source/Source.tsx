import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SideBarItem } from '../../components/SideBar/SideBarItem';
import { AppDispatch } from '../../store';
import { selectSource, setActiveId } from './sourceSlice';
import { SideBar } from '../../components/SideBar';
import { Header } from '../../components/SideBar/Header';

export const Source: React.FC<{ bottom: JSX.Element }> = ({ bottom }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, activeId, mode, totalCount } = useSelector(selectSource);

  const overview = (
    <Header
      mode={mode}
      active={activeId}
      count={totalCount}
      onClick={(id) => dispatch(setActiveId(id))}
    />
  );

  return (
    <SideBar overview={overview} bottom={bottom}>
      {list.map(({ id, name, icon, count }) => (
        <SideBarItem
          key={id.toString()}
          url={icon ?? undefined}
          name={name}
          count={count}
          active={id === activeId}
          onClick={() => dispatch(setActiveId(id))}
        />
      ))}
    </SideBar>
  );
};
