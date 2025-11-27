
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const GitHubStarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

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
      {/* Star button - top right corner */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
        <a
          href="https://github.com/aftab-s/gitwrap-2025"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-sm"
        >
          <GitHubStarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Star</span>
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 group-hover:scale-110 transition-transform" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
        </a>
      </div>

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