import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AppState {
  mode: 'day' | 'night' | 'storm';
}

const initialState: AppState = {
  mode: 'storm',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'day' | 'night' | 'storm'>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = appSlice.actions;
export const selectTheme = (state: RootState) => state.app.mode;
export default appSlice.reducer;
