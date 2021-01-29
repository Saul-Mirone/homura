import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubSideBar } from '../../components/SubSideBar';
import { DateItem } from '../../components/SubSideBar/DateItem';
import { PostItem } from '../../components/SubSideBar/PostItem';
import { AppDispatch } from '../../store';
import {
  loadListBySourceId,
  markActiveUnreadAs,
  markAllAsRead,
  reset,
  selectList,
  setActiveId,
  setFilter,
} from './listSlice';

export const List: React.FC<{ header: JSX.Element }> = ({ header }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, activeId, activeSourceId, mode } = useSelector(selectList);

  React.useEffect(() => {
    if (!activeSourceId) {
      dispatch(reset());
      return;
    }
    dispatch(setActiveId());
    dispatch(loadListBySourceId(activeSourceId, mode));
  }, [activeSourceId, dispatch, mode]);

  return (
    <SubSideBar
      onClick={() => {
        if (!activeId) return;
        dispatch(setActiveId());
      }}
      header={header}
      onReadAll={() => dispatch(markAllAsRead())}
      onSearch={(x) => dispatch(setFilter(x))}
    >
      {groups.map(({ time, posts }) => (
        <DateItem key={time} date={time}>
          {posts.map(({ id, sourceName, title, icon, unread, starred }) => (
            <PostItem
              key={id.toString()}
              active={id === activeId}
              name={title}
              source={sourceName}
              icon={icon === null ? undefined : icon}
              unread={unread}
              starred={starred}
              onClick={() => {
                if (id === activeId) return;
                dispatch(setActiveId(id));
                if (!unread) return;
                dispatch(markActiveUnreadAs(false));
              }}
            />
          ))}
        </DateItem>
      ))}
    </SubSideBar>
  );
};
