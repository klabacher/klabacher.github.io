// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import FrontPage from '@components/FrontPage';
import DashboardPage from '@src/components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/" index element={<FrontPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/*" element={<FrontPage />} />
    </Routes>
  );
}

export default App;
