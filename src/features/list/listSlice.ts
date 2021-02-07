import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { channel } from '../../channel/child';
import { format } from '../../constants/Date';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import { Post, Source } from '../../model/types';
import type { AppThunk, RootState } from '../../store';
import { clearCountById, State as SourceState } from '../source/sourceSlice';

type PostKeys = 'id' | 'sourceId' | 'title' | 'unread' | 'starred' | 'link' | 'date';

type PostItem = Pick<Post, PostKeys> & Pick<Source, 'icon' | 'name'>;

type TimeGroup = {
    time: string;
    posts: PostItem[];
};

export type State = {
    posts: PostItem[];
    activeId: number | undefined;
    filter: string;
};

const initialState: State = {
    posts: [],
    activeId: undefined,
    filter: '',
};

export const getListBySourceId = createAsyncThunk('list/getListBySourceId', (payload: { id: number; mode: Mode }) => {
    const { mode, id } = payload;
    if (mode === Mode.All) {
        return channel.getSourceById(id);
    }

    return channel.getSourceById(id, mode === Mode.Unread ? 'unread' : 'starred');
});

export const getListByPreset = createAsyncThunk('list/getListByPreset', (preset: Preset) => {
    return channel.getPostByPreset(preset);
});

export const markAsUnread = createAsyncThunk(
    'list/markAsUnread',
    async ({ id, unread }: { unread: boolean; id: number }) => {
        await channel.setPostUnread(id, unread);

        return { id, unread };
    },
);

export const markAsStarred = createAsyncThunk(
    'list/markAsStarred',
    async ({ id, starred }: { starred: boolean; id: number }) => {
        await channel.setPostStarred(id, starred);

        return { id, starred };
    },
);

export const markAllAsRead = createAsyncThunk('list/markAllAsRead', async (_: undefined, thunkAPI) => {
    const state = thunkAPI.getState() as { source: SourceState };
    const { activeId, list } = state.source;

    if (typeof activeId === 'number') {
        await channel.markAllAsReadBySourceId(activeId);

        clearCountById(activeId);
        return;
    }

    if (activeId && [Preset.Unread, Preset.All].includes(activeId)) {
        await Promise.all(list.map((x) => channel.markAllAsReadBySourceId(x.id)));
        list.forEach((x) => {
            clearCountById(x.id);
        });
    }
    // dispatch(markAllRead());
});

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        reset: (state) => {
            state.posts = [];
            state.activeId = undefined;
            state.filter = '';
        },
        setActiveId: (state, action: PayloadAction<number | undefined>) => {
            state.activeId = action.payload;
        },
        markAllRead: (state) => {
            state.posts.forEach((post) => {
                post.unread = false;
            });
        },
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getListBySourceId.fulfilled, (state, action) => {
                state.posts = [...action.payload];
            })
            .addCase(getListByPreset.fulfilled, (state, action) => {
                state.posts = [...action.payload];
            })
            .addCase(markAsUnread.fulfilled, (state, action) => {
                const target = state.posts.find((x) => x.id === action.payload.id);

                if (!target) return;

                target.unread = action.payload.unread;
            })
            .addCase(markAsStarred.fulfilled, (state, action) => {
                const target = state.posts.find((x) => x.id === action.payload.id);

                if (!target) return;

                target.starred = action.payload.starred;
            }),
});

export const { setActiveId, markAllRead, setFilter, reset } = listSlice.actions;

export const markAllAsRead = (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const { activeId, list } = state.source;

    if (typeof activeId === 'number') {
        await channel.markAllAsReadBySourceId(activeId);

        clearCountById(activeId);
    } else if (activeId && [Preset.Unread, Preset.All].includes(activeId)) {
        await Promise.all(list.map((x) => channel.markAllAsReadBySourceId(x.id)));
        list.forEach((x) => {
            clearCountById(x.id);
        });
    }
    dispatch(markAllRead());
};

export const listReducer = listSlice.reducer;

export const selectList = (state: RootState) => {
    const { posts, activeId, filter } = state.list;
    const groups = [...posts]
        .map(({ date, ...x }) => ({
            ...x,
            date: DateTime.fromISO(date),
        }))
        .sort((x, y) => y.date.toSeconds() - x.date.toSeconds())
        .map(({ date, ...x }) => ({
            ...x,
            date: date.toFormat(format),
        }))
        .filter((x) => x.title.toLowerCase().includes(filter.toLowerCase()))
        .reduce((acc, cur) => {
            const result = acc.findIndex((x) => x.time === cur.date);

            if (result < 0) {
                return [
                    ...acc,
                    {
                        time: cur.date,
                        posts: [cur],
                    },
                ];
            }

            const target = acc[result];

            return [
                ...acc.slice(0, result),
                {
                    ...target,
                    posts: [...target.posts, cur],
                },
                ...acc.slice(result + 1),
            ];
        }, [] as any[]) as TimeGroup[];
    return {
        activeId,
        groups,
        activeSourceId: state.source.activeId,
        mode: state.mode,
    };
};
