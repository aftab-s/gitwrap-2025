import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import LoaderTestPage from './pages/LoaderTestPage';
import { Analytics } from "@vercel/analytics/react";
import { DEFAULT_YEAR, getEdition } from './config';

/** Only renders its child routes for a known edition (/2025, /2026, …); anything else goes to the landing page. */
function YearGate() {
  const { year } = useParams();
  return getEdition(year) ? <Outlet /> : <Navigate to={`/${DEFAULT_YEAR}`} replace />;
}

/** Old-style /u/<name> links (no year) → the current edition. */
function LegacyUserRedirect() {
  const { username } = useParams();
  return <Navigate to={`/${DEFAULT_YEAR}/u/${username}`} replace />;
}

/**
 *   /            → /<DEFAULT_YEAR>
 *   /2025        → GitWrap 2025 landing page        /2025/u/<name> → that user's 2025 wrap
 *   /2026        → GitWrap 2026 landing page        /2026/u/<name> → that user's 2026 wrap
 *   /u/<name>    → /<DEFAULT_YEAR>/u/<name>         (old links)
 *   anything else → /<DEFAULT_YEAR>
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${DEFAULT_YEAR}`} replace />} />
      <Route path="/loader-test" element={<LoaderTestPage />} />
      <Route path="/u/:username" element={<LegacyUserRedirect />} />
      <Route path="/:year" element={<YearGate />}>
        <Route index element={<HomePage />} />
        <Route path="u/:username" element={<UserPage />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${DEFAULT_YEAR}`} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
        {/* Abstract grid background pattern - larger grid with perspective */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'perspective(1000px) rotateX(60deg)',
            transformOrigin: 'center top',
            height: '200%'
          }}
        />
        {/* Secondary smaller grid for depth */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        <AppRoutes />
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;