import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { channel } from '../../channel/child';
import { Preset } from '../../constants/Preset';
import type { AppThunk, RootState } from '../../store';

type PostItem = {
  id: number;
  sourceId: number;
  title: string;
  sourceName: string;
  unread: boolean;
  starred: boolean;
  date: string;
  icon: string | null;
};

type TimeGroup = {
  time: string;
  posts: PostItem[];
};

type State = {
  groups: TimeGroup[];
  activeId: number | undefined;
};

const initialState: State = {
  groups: [],
  activeId: undefined,
};

type ISOString = string;

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    loadAll: (
      state,
      action: PayloadAction<Array<PostItem & { date: ISOString }>>
    ) => {
      state.groups = [...action.payload]
        .map(({ date, ...x }) => ({
          ...x,
          date: DateTime.fromISO(date),
        }))
        .sort((x, y) => y.date.toSeconds() - x.date.toSeconds())
        .map(({ date, ...x }) => ({
          ...x,
          date: date.toFormat('LLL dd, yyyy'),
        }))
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
        }, [] as TimeGroup[]);
    },
    setActiveId: (state, action: PayloadAction<number>) => {
      state.activeId = action.payload;
    },
    markActiveUnread: (state, action: PayloadAction<boolean>) => {
      const target = state.groups
        .flatMap((x) => x.posts)
        .find((x) => x.id === state.activeId);

      if (!target) return;

      target.unread = action.payload;
    },
  },
});

export const { loadAll, setActiveId, markActiveUnread } = listSlice.actions;

export const loadListBySourceId = (
  sourceId: number | Preset
): AppThunk => async (dispatch) => {
  if (typeof sourceId !== 'number') return;
  const source = await channel.getSourceById(sourceId);

  const posts = source.posts.map(
    ({ id, title, unread, date, starred, sourceId: postSourceId }) => ({
      id,
      sourceId: postSourceId,
      title,
      sourceName: source.name,
      icon: source.icon,
      date: date.toISOString(),
      unread,
      starred,
    })
  );

  dispatch(loadAll(posts));
};

export const markActiveUnreadAs = (unread: boolean): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();
  if (!state.list.activeId) return;
  await channel.setPostUnread(state.list.activeId, unread);
  dispatch(markActiveUnread(unread));
};

export const listReducer = listSlice.reducer;

export const selectList = (state: RootState) => ({
  ...state.list,
  activeSourceId: state.source.activeId,
  mode: state.mode,
});
