import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { channel } from '../../channel/child';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import type { AppThunk, RootState } from '../../store';

type SourceItem = {
  id: number;
  name: string;
  link: string;
  icon?: string;
  count: number;
};

type State = {
  totalCount: number;
  list: SourceItem[];
  activeId: number | Preset | undefined;
};

const initialState: State = {
  totalCount: 0,
  list: [],
  activeId: undefined,
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
    setActiveId: (
      state,
      action: PayloadAction<number | Preset | undefined>
    ) => {
      state.activeId = action.payload;
    },
  },
});

export const { loadAll, create, setActiveId } = sourceSlice.actions;

export const loadSource = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const countType = state.mode === Mode.Starred ? 'starred' : 'unread';
  const list = await channel.getSourceList(countType);

  const mappedList = list.map(({ id, name, link, count, icon }) => ({
    id,
    icon: icon === null ? undefined : icon,
    name,
    link,
    count,
  }));

  dispatch(loadAll(mappedList));
};

export const sourceReducer = sourceSlice.reducer;

export const selectSource = (state: RootState) => ({
  ...state.source,
  mode: state.mode,
});
