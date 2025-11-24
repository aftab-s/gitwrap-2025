import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import LoaderTestPage from './pages/LoaderTestPage';
import TokenWarningBanner from './components/TokenWarningBanner';
import { Analytics } from "@vercel/analytics/react";

// This check determines if the warning banner should be displayed.
const isTokenMissing = !process.env.VITE_GITHUB_APP_TOKEN;

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
       
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/u/:username" element={<UserPage />} />
          <Route path="/loader-test" element={<LoaderTestPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;