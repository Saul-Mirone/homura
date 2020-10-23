import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Preset } from '../../constants/Preset';
import type { AppThunk, RootState } from '../../store';
import { channel } from '../../channel/child';
import { Mode } from '../../constants/Mode';

type SourceItem = {
  id: number;
  name: string;
  link: string;
  icon?: string;
  count: number;
};

type State = {
  totalCount: number;
  activeId?: number | Preset;
  list: SourceItem[];
};

const initialState: State = {
  totalCount: 0,
  list: [],
};

const sourceSlice = createSlice({
  name: 'source',
  initialState,
  reducers: {
    loadAll: (state, action: PayloadAction<SourceItem[]>) => {
      state.list = action.payload;
      state.totalCount = action.payload.reduce(
        (acc, cur) => acc + cur.count,
        0
      );
    },
    create: (state, action: PayloadAction<SourceItem>) => {
      const { id, count } = action.payload;
      state.list.push(action.payload);
      state.activeId = id;
      state.totalCount += count;
    },
    setActiveId: (state, action: PayloadAction<number | Preset>) => {
      state.activeId = action.payload;
    },
  },
});

export const { loadAll, create, setActiveId } = sourceSlice.actions;

export const loadSource = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const countType = state.mode === Mode.Starred ? 'starred' : 'unread';
  channel
    .getSourceList(countType)
    .then((list) =>
      loadAll(
        list.map(({ icon, ...rest }) => ({
          icon: icon === null ? undefined : icon,
          ...rest,
        }))
      )
    )
    .then(dispatch)
    .catch(() => {});
};

export const sourceReducer = sourceSlice.reducer;

export const selectSource = (state: RootState) => ({
  ...state.source,
  mode: state.mode,
});
