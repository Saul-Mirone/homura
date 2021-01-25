import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { channel } from '../../channel/child';
import { format } from '../../constants/Date';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import type { AppThunk, RootState } from '../../store';
import { modifyCount } from '../source/sourceSlice';

type ISOString = string;
type PostItem = {
  id: number;
  sourceId: number;
  title: string;
  sourceName: string;
  link: string;
  unread: boolean;
  starred: boolean;
  date: ISOString;
  icon: string | null;
};

type TimeGroup = {
  time: string;
  posts: PostItem[];
};

type State = {
  posts: PostItem[];
  activeId: number | undefined;
  filter: string;
};

const initialState: State = {
  posts: [],
  activeId: undefined,
  filter: '',
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    reset: (state) => {
      state.posts = [];
      state.activeId = undefined;
      state.filter = '';
    },
    loadAll: (state, action: PayloadAction<PostItem[]>) => {
      state.posts = action.payload;
    },
    setActiveId: (state, action: PayloadAction<number | undefined>) => {
      state.activeId = action.payload;
    },
    markActiveUnread: (state, action: PayloadAction<boolean>) => {
      const target = state.posts.find((x) => x.id === state.activeId);

      if (!target) return;

      target.unread = action.payload;
    },
    markActiveStarred: (state, action: PayloadAction<boolean>) => {
      const target = state.posts.find((x) => x.id === state.activeId);

      if (!target) return;

      target.starred = action.payload;
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
});

export const {
  loadAll,
  setActiveId,
  markActiveUnread,
  markActiveStarred,
  markAllRead,
  setFilter,
  reset,
} = listSlice.actions;

const loadBySourceId = async (sourceId: number, mode: Mode) => {
  const source = await channel.getSourceById(sourceId);

  return source.posts
    .map(
      ({ id, title, unread, date, starred, sourceId: postSourceId, link }) => ({
        id,
        sourceId: postSourceId,
        title,
        link,
        sourceName: source.name,
        icon: source.icon,
        date: date.toISOString(),
        unread,
        starred,
      })
    )
    .filter((x) => {
      switch (mode) {
        case Mode.Starred:
          return x.starred;
        case Mode.Unread:
          return x.unread;
        case Mode.All:
        default:
          return true;
      }
    });
};
const loadByPreset = async (preset: Preset) => {
  return (await channel.getPostByPreset(preset)).map(
    ({
      id,
      title,
      unread,
      link,
      date,
      starred,
      sourceId,
      sourceName,
      icon,
    }) => ({
      id,
      sourceId,
      title,
      link,
      sourceName,
      icon,
      unread,
      starred,
      date: date.toISOString(),
    })
  );
};

export const loadListBySourceId = (
  sourceIdOrPreset: number | Preset,
  mode: Mode
): AppThunk => async (dispatch) => {
  if (typeof sourceIdOrPreset === 'number') {
    const posts = await loadBySourceId(sourceIdOrPreset, mode);

    dispatch(loadAll(posts));
    return;
  }

  const posts = await loadByPreset(sourceIdOrPreset);
  dispatch(loadAll(posts));
};

export const markAllAsRead = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const { activeId, list } = state.source;

  if (typeof activeId === 'number') {
    await channel.markAllAsReadBySourceId(activeId);
    dispatch(modifyCount({ id: activeId, modifier: () => 0 }));
  } else if (activeId && [Preset.Unread, Preset.All].includes(activeId)) {
    await Promise.all(list.map((x) => channel.markAllAsReadBySourceId(x.id)));
    list.forEach((x) => {
      dispatch(modifyCount({ id: x.id, modifier: () => 0 }));
    });
  }
  dispatch(markAllRead());
};

export const markActiveUnreadAs = (unread: boolean): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.list.activeId) return;
  await channel.setPostUnread(state.list.activeId, unread);
  const { posts } = state.list;
  const active = posts.find((x) => x.id === state.list.activeId);
  if (active && state.mode !== Mode.Starred) {
    if (unread) {
      dispatch(
        modifyCount({ id: active.sourceId, modifier: (x: number) => x + 1 })
      );
    } else {
      dispatch(
        modifyCount({ id: active.sourceId, modifier: (x: number) => x - 1 })
      );
    }
  }
  dispatch(markActiveUnread(unread));
};
export const markActiveStarredAs = (starred: boolean): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.list.activeId) return;
  await channel.setPostStarred(state.list.activeId, starred);
  const { posts } = state.list;
  const active = posts.find((x) => x.id === state.list.activeId);
  if (active && state.mode === Mode.Starred) {
    if (starred) {
      dispatch(
        modifyCount({ id: active.sourceId, modifier: (x: number) => x + 1 })
      );
    } else {
      dispatch(
        modifyCount({ id: active.sourceId, modifier: (x: number) => x - 1 })
      );
    }
  }
  dispatch(markActiveStarred(starred));
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
