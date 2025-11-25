
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import Contributors from '../components/Contributors';

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
  <div className="flex flex-col items-center justify-center min-h-screen px-4 py-5 sm:py-6 md:py-8 lg:py-10 xl:py-12 relative">
      <div className="text-center relative z-10">
  <div className="inline-block bg-white/10 p-2 sm:p-3 rounded-full mb-3 sm:mb-4">
    <SparklesIcon className="w-9 h-9 sm:w-10 sm:h-10 text-purple-300" />
        </div>
  <h1 className="text-[1.9rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4.25rem] font-bold text-white tracking-tighter leading-tight">
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
  <p className="mt-1 text-[0.85rem] sm:text-[0.95rem] md:text-base text-gray-300 max-w-xl mx-auto">
          Get your personalized GitHub year in review. See your coding journey, celebrate your achievements, and share your story.
        </p>
      </div>

  <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 md:mt-6 w-full max-w-md relative z-10">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            placeholder="Your GitHub username"
            className="w-full pl-4 pr-32 py-4 text-lg bg-white/5 text-white border-2 border-transparent rounded-full focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-gray-400"
            aria-label="GitHub Username"
          />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white font-semibold py-2 sm:py-2 md:py-2.5 px-3.5 sm:px-4.5 md:px-5 rounded-full text-[0.75rem] sm:text-[0.85rem] md:text-sm hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300"
          >
            Generate
          </button>
        </div>
        {error && <p className="mt-2 text-center text-red-400">{error}</p>}
      </form>

      <div className="mt-2 sm:mt-3 md:mt-4 relative z-10">
        <Contributors />
      </div>

      <footer className="mt-3 sm:mt-4 text-center text-gray-500 text-[0.6rem] sm:text-[0.7rem] md:text-xs z-10 w-full lg:w-auto lg:absolute lg:bottom-3">
        Built with React, Tailwind CSS, and Gemini
      </footer>
    </div>
  );
};

export default HomePage;