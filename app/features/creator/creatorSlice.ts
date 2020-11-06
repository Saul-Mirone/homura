import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { channel } from '../../channel/child';
import { Step } from '../../components/SideBar/BottomBar';
import { Mode } from '../../constants/Mode';
import type { AppThunk, RootState } from '../../store';
import { create } from '../source/sourceSlice';

type State = {
  link: string;
  name: string;
  loading: boolean;
  parseError: boolean;
  step: Step | null;
};

const initialState: State = {
  link: '',
  name: '',
  loading: false,
  parseError: false,
  step: null,
};

const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    stepToEnterUrl: (state) => {
      state.step = Step.EnterUrl;
    },
    stepToEnterName: (state) => {
      state.step = Step.EnterName;
    },
    reset: (state) => {
      state.step = null;
      state.link = '';
      state.name = '';
      state.loading = false;
      state.parseError = false;
    },
    setParserError: (state, action: PayloadAction<boolean>) => {
      state.parseError = action.payload;
    },
    setLink: (state, action: PayloadAction<string>) => {
      state.link = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  stepToEnterName,
  stepToEnterUrl,
  reset,
  setLink,
  setName,
  setParserError,
  setLoading,
} = creatorSlice.actions;

export const searchUrl = (link: string): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setLink(link));

  const result = await channel.checkUrl(link);
  if (!result) {
    dispatch(setLoading(false));
    dispatch(setParserError(true));
    return;
  }

  dispatch(setName(result));
  dispatch(stepToEnterName());
  dispatch(setLoading(false));
};

export const confirmName = (name: string): AppThunk => async (
  dispatch,
  getState
) => {
  dispatch(setName(name));
  const { mode } = getState();

  const { posts, icon, link, id } = await channel.confirm(name);

  const rssSource = {
    id,
    name,
    link,
    icon: icon === null ? undefined : icon,
    count: mode === Mode.Starred ? 0 : posts.length,
  };

  dispatch(create(rssSource));
  dispatch(reset());
};

export const creatorReducer = creatorSlice.reducer;

export const selectCreator = (state: RootState) => {
  return {
    ...state.creator,
    refreshing: state.source.refreshing,
  };
};
