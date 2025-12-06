import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AppState {
  mode: 'day' | 'night' | 'storm';
  isModalOpen: boolean; // Novo estado
}

const initialState: AppState = {
  mode: 'storm',
  isModalOpen: false, // Inicialmente fechado
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<'day' | 'night' | 'storm'>) => {
      state.mode = action.payload;
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

export const { setMode, setModalOpen } = appSlice.actions;
export const selectTheme = (state: RootState) => state.app.mode;
export const selectModalOpen = (state: RootState) => state.app.isModalOpen; // Selector
export default appSlice.reducer;
