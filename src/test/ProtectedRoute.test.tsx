import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../components/ProtectedRoute';
import appReducer from '../store/slices/appSlice';
import authReducer, { type AuthState } from '../store/slices/authSlice';

const renderWithState = (authState: Partial<AuthState>) => {
  const store = configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
    },
    preloadedState: {
      app: { mode: 'storm', isModalOpen: false },
      auth: {
        session: null,
        user: null,
        profile: null,
        status: 'idle',
        error: null,
        ...authState,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div data-testid="private">privado</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div data-testid="home">home</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  it('redirects to home when not authenticated', () => {
    renderWithState({ status: 'idle' });
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    renderWithState({ status: 'authenticated' });
    expect(screen.getByTestId('private')).toBeInTheDocument();
  });
});
