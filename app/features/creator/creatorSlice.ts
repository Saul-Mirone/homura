import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { channel } from '../../channel/child';
import { Step } from '../../components/SideBar/BottomBar';
import { Mode } from '../../constants/Mode';
import type { AppThunk, RootState } from '../../store';
import { create } from '../source/sourceSlice';

type State = {
  link: string;
  name: string;
  step: Step | null;
};

const initialState: State = {
  link: '',
  name: '',
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
    },
    setLink: (state, action: PayloadAction<string>) => {
      state.link = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const {
  stepToEnterName,
  stepToEnterUrl,
  reset,
  setLink,
  setName,
} = creatorSlice.actions;

export const searchUrl = (): AppThunk => async (dispatch, getState) => {
  const {
    creator: { link },
  } = getState();

  const result = await channel.checkUrl(link);
  if (!result) {
    return;
  }

  dispatch(setName(result));
  dispatch(stepToEnterName());
};

export const confirmName = (): AppThunk => async (dispatch, getState) => {
  const {
    creator: { name },
    mode,
  } = getState();

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

export const selectCreator = (state: RootState) => state.creator;
