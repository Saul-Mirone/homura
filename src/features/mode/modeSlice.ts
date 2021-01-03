import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode } from '../../constants/Mode';
import type { RootState } from '../../store';

const modeSlice = createSlice({
  name: 'mode',
  initialState: Mode.All,
  reducers: {
    switchMode: (_, action: PayloadAction<Mode>) => action.payload,
  },
});

export const { switchMode } = modeSlice.actions;

export const modeReducer = modeSlice.reducer;

export const selectMode = (state: RootState) => state.mode;
