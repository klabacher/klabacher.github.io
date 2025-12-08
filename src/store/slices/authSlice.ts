import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Session, User } from '@supabase/supabase-js';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface ProfileSummary {
  id: string;
  email: string | null;
  avatarUrl?: string | null;
  username?: string | null;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: ProfileSummary | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  status: 'idle',
  error: null,
};

const toProfile = (user: User | null): ProfileSummary | null => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    avatarUrl: (user.user_metadata as Record<string, unknown> | null)?.avatar_url as
      | string
      | undefined,
    username: (user.user_metadata as Record<string, unknown> | null)?.user_name as
      | string
      | undefined,
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: state => {
      state.status = 'loading';
      state.error = null;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      const session = action.payload;
      state.session = session;
      state.user = session?.user ?? null;
      state.profile = toProfile(session?.user ?? null);
      state.status = session ? 'authenticated' : 'idle';
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = action.payload ? 'error' : state.status;
    },
    resetAuth: () => initialState,
  },
});

export const { setLoading, setSession, setError, resetAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === 'authenticated';
