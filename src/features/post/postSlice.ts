import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { channel } from '../../channel/child';
import { format } from '../../constants/Date';
import type { AppThunk, RootState } from '../../store';

type State = {
  content: string;
};

const initialState: State = {
  content: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
  },
});

export const { setContent } = postSlice.actions;

export const getPostContentById = (postId: number): AppThunk => async (
  dispatch
) => {
  const post = await channel.getPostById(postId);
  dispatch(setContent(post.content));
};

export const postReducer = postSlice.reducer;

export const selectPost = (state: RootState) => {
  const { activeId, posts } = state.list;
  const { content } = state.post;

  if (!activeId)
    return {
      activeId,
    };

  const target = posts.find((x) => x.id === activeId);

  if (!target)
    return {
      activeId,
    };

  const { title, sourceName, unread, starred, date, link } = target;

  const post = {
    title,
    sourceName,
    unread,
    link,
    date: DateTime.fromISO(date).toFormat(format),
    starred,
    content,
  };

  return {
    activeId,
    post,
  };
};
