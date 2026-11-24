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
      {/* 2026 default root */}
      <Route path="/" element={<HomePage />} />
      <Route path="/u/:username" element={<UserPage />} />

      {/* Explicit /2026 redirects */}
      <Route path="/2026" element={<Navigate to="/" replace />} />
      <Route path="/2026/u/:username" element={<LegacyUserRedirect />} />
      <Route path="/2026/:username" element={<LegacyUserRedirect />} />

      {/* Legacy segment redirects (e.g. /year/username) */}
      <Route path="/:year/:username" element={<LegacyUserRedirect />} />

      {/* Catch-all */}
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
