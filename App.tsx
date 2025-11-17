import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import TokenWarningBanner from './components/TokenWarningBanner';

// This check determines if the warning banner should be displayed.
const isTokenMissing = !process.env.GITHUB_APP_TOKEN;

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
       
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/u/:username" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;