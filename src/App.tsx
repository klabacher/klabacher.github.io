// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import FrontPage from '@components/FrontPage';
import DashboardPage from '@src/components/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" index element={<FrontPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/*" element={<FrontPage />} />
    </Routes>
  );
}

export default App;
