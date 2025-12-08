import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';
import type { PropsWithChildren } from 'react';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { status } = useSelector(selectAuth);
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center w-full h-screen text-white">
        <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
          Carregando...
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
