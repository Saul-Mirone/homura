import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Reader } from '../../components/Reader';
import { AppDispatch } from '../../store';
import { getPostContentById, selectPost } from './postSlice';

export const Post: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { post, activeId } = useSelector(selectPost);

  React.useEffect(() => {
    if (!activeId) return;
    dispatch(getPostContentById(activeId));
  }, [activeId, dispatch]);

  return <Reader post={post} />;
};
