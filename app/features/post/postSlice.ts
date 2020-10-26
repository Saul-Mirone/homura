import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { channel } from '../../channel/child';
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
  const { activeId, groups } = state.list;
  if (!activeId)
    return {
      activeId,
    };

  const postList = groups.flatMap((x) => x.posts);
  const target = postList.find((x) => x.id === activeId);

  if (!target)
    return {
      activeId,
    };

  const { title, sourceName, unread, starred, date } = target;

  const post = {
    title,
    sourceName,
    unread,
    date,
    starred,
    content: state.post.content,
  };

  return {
    activeId,
    post,
  };
};