import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import { Analytics } from "@vercel/analytics/react";

function LegacyUserRedirect() {
  const { username } = useParams<{ username: string }>();
  return <Navigate to={username ? `/u/${username}` : '/'} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/u/:username" element={<UserPage />} />
      <Route path="/:year/:username" element={<LegacyUserRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
