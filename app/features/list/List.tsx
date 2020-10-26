import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubSideBar } from '../../components/SubSideBar';
import { DateItem } from '../../components/SubSideBar/DateItem';
import { PostItem } from '../../components/SubSideBar/PostItem';
import { AppDispatch } from '../../store';
import {
  loadListBySourceId,
  markActiveUnreadAs,
  selectList,
  setActiveId,
} from './listSlice';

export const List: React.FC<{ header: JSX.Element }> = ({ header }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, activeId, activeSourceId } = useSelector(selectList);

  React.useEffect(() => {
    if (!activeSourceId) return;
    dispatch(loadListBySourceId(activeSourceId));
  }, [activeSourceId, dispatch]);

  return (
    <SubSideBar header={header}>
      {groups.map(({ time, posts }) => (
        <DateItem key={time} date={time}>
          {posts.map(({ id, sourceName, title, icon, unread, starred }) => (
            <PostItem
              key={id.toString()}
              id={id}
              active={id === activeId}
              name={title}
              source={sourceName}
              icon={icon === null ? undefined : icon}
              unread={unread}
              starred={starred}
              onClick={() => {
                if (id === activeId) return;
                dispatch(setActiveId(id));
                dispatch(markActiveUnreadAs(false));
              }}
            />
          ))}
        </DateItem>
      ))}
    </SubSideBar>
  );
};
