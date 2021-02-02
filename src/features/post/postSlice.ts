import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import { DateTime } from 'luxon';
import { channel } from '../../channel/child';
import { format } from '../../constants/Date';
import type { RootState } from '../../store';

export type State = {
    content: string;
};

const initialState: State = {
    content: '',
};

export const getPostContentById = createAsyncThunk('post/getPostContentById', async (postId: number) => {
    const { content } = await channel.getPostById(postId);
    return content;
});

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder.addCase(getPostContentById.fulfilled, (state, action) => {
            state.content = action.payload;
        }),
});

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

    const data = pick(target, ['title', 'sourceName', 'unread', 'starred', 'link']);
    const { date } = target;

    const post = {
        ...data,
        content,
        date: DateTime.fromISO(date).toFormat(format),
    };

    return {
        activeId,
        post,
    };
};
