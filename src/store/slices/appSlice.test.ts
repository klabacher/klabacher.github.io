import { describe, expect, it } from 'vitest';
import reducer, { setModalOpen, setMode } from './appSlice';

describe('appSlice', () => {
  it('starts with the storm theme and a closed modal', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      mode: 'storm',
      isModalOpen: false,
    });
  });

  it('changes the animated background theme', () => {
    const state = reducer(undefined, setMode('night'));

    expect(state.mode).toBe('night');
  });

  it('tracks whether a project modal is open', () => {
    const state = reducer(undefined, setModalOpen(true));

    expect(state.isModalOpen).toBe(true);
  });
});
