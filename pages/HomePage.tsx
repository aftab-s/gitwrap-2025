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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050812] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),_transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.07),_transparent_40%)]"
        aria-hidden="true"
      />

      <main className="relative z-10 flex flex-1 px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-7 sm:gap-9 lg:gap-10">
          <section className="flex w-full flex-col items-center text-center gap-3 sm:gap-4">
            <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 sm:p-4">
              <SparklesIcon className="h-10 w-10 sm:h-12 sm:w-12 text-purple-300" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-balance font-bold leading-tight tracking-tight text-[clamp(2.3rem,2.8vw,3.8rem)] md:text-[clamp(2.6rem,2.8vw,4.2rem)]">
                GitWrap <span className="text-purple-400">2025</span>
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-base text-gray-300 sm:text-[1.05rem]">
                Get your personalized GitHub year in review. See your coding journey, celebrate your achievements, and share your story.
              </p>
            </div>
          </section>

          <section className="w-full max-w-3xl md:max-w-2xl">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/5/90 p-4 backdrop-blur-md sm:p-5 md:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label htmlFor="username" className="sr-only">
                  GitHub Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your GitHub username"
                  className="w-full flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder-gray-400 transition focus:border-purple-500 focus:bg-white/15 focus:outline-none sm:rounded-full sm:text-lg"
                  aria-invalid={!!error}
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-purple-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/40 sm:w-auto sm:rounded-full sm:px-8 sm:py-3.5 md:px-6"
                >
                  Generate
                </button>
              </div>
              {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
            </form>
          </section>

          <section className="w-full max-w-xl space-y-3 text-center mt-4 sm:mt-6">
            <Contributors />
            <p className="text-xs text-gray-500 sm:text-sm">Built with React, Tailwind CSS, and Gemini</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
