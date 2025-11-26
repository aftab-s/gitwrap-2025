
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
  <div className="flex flex-col items-center justify-center min-h-screen h-screen overflow-hidden px-4 relative">
      <div className="text-center relative z-10">
  <div className="inline-block bg-white/10 p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
    <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300" />
        </div>
  <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4.25rem] font-bold text-white tracking-tighter leading-none">
          GitWrap{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #34d399 20%, #fb923c 40%, #ec4899 60%, #38bdf8 80%, #64748b 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            2025
          </span>
        </h1>
  <p className="mt-2 sm:mt-3 text-[0.8rem] sm:text-[0.95rem] md:text-base text-gray-300 max-w-xl mx-auto px-2">
          Get your personalized GitHub year in review. See your coding journey, celebrate your achievements, and share your story.
        </p>
      </div>

  <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 md:mt-8 w-full max-w-md px-4 sm:px-0 relative z-10">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            placeholder="Your GitHub username"
            className="w-full pl-4 pr-24 sm:pr-28 md:pr-32 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg bg-white/5 text-white border-2 border-transparent rounded-full focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-gray-400"
            aria-label="GitHub Username"
          />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 rounded-full text-xs sm:text-sm md:text-base hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300"
          >
            Generate
          </button>
        </div>
        {error && <p className="mt-2 text-center text-red-400">{error}</p>}
      </form>

      <footer className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-0 right-0 text-center z-10 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-gray-400 text-[0.65rem] sm:text-[0.7rem] md:text-xs">
            Made with 💜 for developers
          </span>
          <span className="hidden sm:inline text-gray-600">•</span>
          <span className="text-gray-500 text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem]">
            Powered by React, Tailwind & Gemini AI
          </span>
        </div>
        <div className="mt-1 text-gray-600 text-[0.6rem] sm:text-[0.65rem]">
          Celebrating your open source journey 🚀
        </div>
      </footer>
    </div>
  );
};

export default HomePage;