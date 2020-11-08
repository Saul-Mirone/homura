import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { channel } from '../../channel/child';
import { Step } from '../../components/SideBar/BottomBar';
import { Mode } from '../../constants/Mode';
import { Preset } from '../../constants/Preset';
import { Status } from '../../constants/Status';
import type { RootState } from '../../store';

type SourceItem = {
  id: number;
  name: string;
  link: string;
  count: number;
  icon: string | null;
};

type SourceListState = {
  activeId: number | Preset | null;
  list: SourceItem[];
  fetchListStatus: Status;
};

type SourceSubscribeState = {
  subscribeLink: string;
  subscribeName: string;
  subscribeStep: Step | null;
  subscribeStatus: Status;
  subscribeError: null | string;
};

export type State = SourceListState & SourceSubscribeState;

const initialSourceList: SourceListState = {
  list: [],
  activeId: null,
  fetchListStatus: Status.Idle,
};

const initialSourceSubscribeState: SourceSubscribeState = {
  subscribeLink: '',
  subscribeName: '',
  subscribeStep: null,
  subscribeStatus: Status.Idle,
  subscribeError: null,
};

const initialState: State = {
  ...initialSourceList,
  ...initialSourceSubscribeState,
};

const fetchSourceListAPI = (mode: Mode) => {
  const countType = mode === Mode.Starred ? 'starred' : 'unread';
  return channel.getSourceList(countType);
};

export const fetchSources = createAsyncThunk(
  'source/fetchSources',
  (mode: Mode) => {
    return fetchSourceListAPI(mode);
  }
);

export const syncSources = createAsyncThunk(
  'source/syncSources',
  async (mode: Mode) => {
    await channel.sync();
    return fetchSourceListAPI(mode);
  }
);

export const unsubscribeById = createAsyncThunk(
  'source/unsubscribeById',
  async (id: number) => {
    await channel.removeSourceById(id);
    return id;
  }
);

export const updateSourceById = createAsyncThunk(
  'source/updateSourceById',
  async ({ id, name }: { id: number; name: string }) => {
    await channel.updateSourceNameById(id, name);

    return { id, name };
  }
);

export const searchUrlForSource = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('source/searchUrlForSource', async (link: string, thunkAPI) => {
  const result = await channel.checkUrl(link);
  if (!result) {
    thunkAPI.rejectWithValue('ParseRSSFailed');
  }
  return result;
});

export const subscribeToSource = createAsyncThunk(
  'source/subscribeToSource',
  async ({ name, mode }: { name: string; mode: Mode }) => {
    const { posts, icon, link, id } = await channel.confirm(name);

    return {
      id,
      name,
      link,
      icon,
      count: mode === Mode.Starred ? 0 : posts.length,
    };
  }
);

const sourceSlice = createSlice({
  name: 'source',
  initialState,
  reducers: {
    setCurrentSource: (
      state,
      action: PayloadAction<number | Preset | null>
    ) => {
      state.activeId = action.payload;
    },
    countDownOne: (state, action: PayloadAction<number>) => {
      const target = state.list.find((x) => x.id === action.payload);
      if (!target) return;
      target.count -= 1;
    },
    countUpOne: (state, action: PayloadAction<number>) => {
      const target = state.list.find((x) => x.id === action.payload);
      if (!target) return;
      target.count += 1;
    },
    countToZero: (state, action: PayloadAction<number>) => {
      const target = state.list.find((x) => x.id === action.payload);
      if (!target) return;
      target.count = 0;
    },
    showSubscribeBar: (state) => {
      state.subscribeStep = Step.EnterUrl;
    },
    resetSubscribeError: (state) => {
      state.subscribeError = null;
    },
    resetSubscribeState: (state) => {
      state.subscribeStep = null;
      state.subscribeError = null;
      state.subscribeLink = '';
      state.subscribeName = '';
      state.subscribeStatus = Status.Idle;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchSources.pending, (state) => {
        state.fetchListStatus = Status.Pending;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.fetchListStatus = Status.Succeeded;
        state.list = action.payload;
      })
      .addCase(fetchSources.rejected, (state) => {
        state.fetchListStatus = Status.Failed;
      })
      .addCase(syncSources.pending, (state) => {
        state.fetchListStatus = Status.Pending;
      })
      .addCase(syncSources.fulfilled, (state, action) => {
        state.fetchListStatus = Status.Succeeded;
        state.list = action.payload;
      })
      .addCase(syncSources.rejected, (state) => {
        state.fetchListStatus = Status.Failed;
      })
      .addCase(unsubscribeById.fulfilled, (state, action) => {
        state.activeId = null;
        state.list = state.list.filter((x) => x.id !== action.payload);
      })
      .addCase(updateSourceById.fulfilled, (state, action) => {
        state.activeId = null;
        const target = state.list.find((x) => x.id === action.payload.id);
        if (!target) return;
        target.name = action.payload.name;
      })
      .addCase(searchUrlForSource.pending, (state, action) => {
        state.subscribeLink = action.meta.arg;
        state.subscribeStatus = Status.Pending;
      })
      .addCase(searchUrlForSource.fulfilled, (state, action) => {
        state.subscribeName = action.payload;
        state.subscribeStep = Step.EnterName;
      })
      .addCase(searchUrlForSource.rejected, (state, action) => {
        state.subscribeStatus = Status.Failed;
        if (action.payload) {
          state.subscribeError = action.payload;
        }
      })
      .addCase(subscribeToSource.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.list.push(action.payload);
        state.activeId = id;
        state.subscribeStep = null;
        state.subscribeError = null;
        state.subscribeLink = '';
        state.subscribeName = '';
      }),
});

export const {
  setCurrentSource,
  resetSubscribeError,
  resetSubscribeState,
  showSubscribeBar,

  countDownOne,
  countUpOne,
  countToZero,
} = sourceSlice.actions;

export const sourceReducer = sourceSlice.reducer;

export const selectSourceList = (state: RootState) => {
  const { source, mode } = state;
  const totalCount = source.list.reduce((acc, cur) => acc + cur.count, 0);
  const { list, activeId } = source;

  return {
    activeId,
    totalCount,
    mode,
    list: list.filter((x) => {
      if (mode === Mode.All || activeId === x.id) return true;
      return x.count > 0;
    }),
  };
};

export const selectSourceOperation = (state: RootState) => {
  const { source, mode } = state;
  const {
    subscribeLink,
    subscribeName,
    subscribeStep,
    subscribeStatus,
    subscribeError,
    fetchListStatus,
  } = source;
  const loading =
    subscribeStatus === Status.Pending || fetchListStatus === Status.Pending;
  return {
    mode,
    subscribeLink,
    subscribeName,
    subscribeStep,
    subscribeError,
    loading,
  };
};
