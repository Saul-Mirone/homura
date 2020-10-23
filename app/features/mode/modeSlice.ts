import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode } from '../../constants/Mode';

const modeSlice = createSlice({
  name: 'mode',
  initialState: Mode.All,
  reducers: {
    switchMode: (_, action: PayloadAction<Mode>) => action.payload,
  },
});

export const { switchMode } = modeSlice.actions;

export const modeReducer = modeSlice.reducer;
