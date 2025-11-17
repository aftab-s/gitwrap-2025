
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/u/${username.trim()}`);
    } else {
      setError('Please enter a GitHub username.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-purple-900/50">
      <div className="text-center">
        <div className="inline-block bg-white/10 p-4 rounded-full mb-6">
          <SparklesIcon className="w-12 h-12 text-purple-300" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
          GitWrap <span className="text-purple-400">2025</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Get your personalized GitHub year in review. See your coding journey, celebrate your achievements, and share your story.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your GitHub username"
            className="w-full pl-4 pr-32 py-4 text-lg bg-white/5 text-white border-2 border-transparent rounded-full focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-gray-400"
            aria-label="GitHub Username"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300"
          >
            Generate
          </button>
        </div>
        {error && <p className="mt-2 text-center text-red-400">{error}</p>}
      </form>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        Built with React, Tailwind CSS, and Gemini
      </footer>
    </div>
  );
};

export default HomePage;
