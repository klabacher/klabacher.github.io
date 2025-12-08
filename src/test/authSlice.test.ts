import { describe, expect, it } from 'vitest';
import authReducer, {
  setError,
  setSession,
  resetAuth,
  type AuthState,
} from '../store/slices/authSlice';
import type { Session } from '@supabase/supabase-js';

const baseState: AuthState = {
  session: null,
  user: null,
  profile: null,
  status: 'idle',
  error: null,
};

describe('authSlice', () => {
  it('should handle setSession with session', () => {
    const fakeSession = {
      user: { id: '1', email: 'test@example.com', user_metadata: {} },
    } as unknown as Session;
    const state = authReducer(baseState, setSession(fakeSession));
    expect(state.status).toBe('authenticated');
    expect(state.user?.email).toBe('test@example.com');
  });

  it('should handle setError', () => {
    const state = authReducer(baseState, setError('oops'));
    expect(state.error).toBe('oops');
    expect(state.status).toBe('error');
  });

  it('should reset auth state', () => {
    const dirty = { ...baseState, status: 'authenticated', error: 'x' };
    const state = authReducer(dirty, resetAuth());
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });
});
