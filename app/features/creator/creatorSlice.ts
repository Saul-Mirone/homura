import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Step } from '../../components/SideBar/BottomBar';

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
