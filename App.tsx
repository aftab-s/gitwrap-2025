import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import ThemesPage from './pages/ThemesPage';
import { Analytics } from "@vercel/analytics/react";

function LegacyUserRedirect() {
  const { username } = useParams<{ username: string }>();
  return <Navigate to={username ? `/u/${username}` : '/'} replace />;
}

function Redirect2025() {
  React.useEffect(() => {
    const subpath = window.location.pathname.replace(/^\/2025\/?/, '');
    const dest = subpath
      ? `https://gitwrap-2025-ten.vercel.app/${subpath}${window.location.search}`
      : `https://gitwrap-2025-ten.vercel.app/${window.location.search}`;
    window.location.replace(dest);
  }, []);
  return null;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* 2026 default root */}
      <Route path="/" element={<HomePage />} />
      <Route path="/themes" element={<ThemesPage />} />
      <Route path="/u/:username" element={<UserPage />} />

      {/* 2025 standalone deployment redirects */}
      <Route path="/2025" element={<Redirect2025 />} />
      <Route path="/2025/*" element={<Redirect2025 />} />

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
