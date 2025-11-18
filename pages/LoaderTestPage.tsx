import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Endpoint demo settings
const LOADER_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/loader-test' : '/api/loader-test';

const LoaderTestPage: React.FC = () => {
  const [fetching, setFetching] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const triggerFetch = async () => {
    setFetching(true);
    setResult(null);
    setFetchError(null);
    try {
      const res = await fetch(LOADER_ENDPOINT, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setFetchError(String(err.message || err));
    } finally {
      setFetching(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-block mb-8 text-purple-400 hover:text-purple-300">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Loader Component Test</h1>
        
        <div className="space-y-12">
          {/* Full Page Loading State */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Full Page Loading (Medium Size)</h2>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center space-y-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-ping"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-40 blur-xl"></div>
                      <svg className="relative w-24 h-24 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <LoadingSpinner />
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Wrapping up username's 2025</h2>
                    <p className="text-gray-400 text-sm">Analyzing contributions, calculating stats, and generating insights...</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Inline Loading State */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Inline Loading (Small Size)</h2>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div className="flex items-center justify-center gap-4">
                <LoadingSpinner size="sm" />
                <span className="text-gray-300">Processing...</span>
              </div>
            </div>
          </section>

          {/* Endpoint Loading State */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Endpoint Loading Test</h2>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div className="flex flex-col items-center gap-6">
                <p className="text-gray-300">This will call <code className="text-xs text-gray-400">{LOADER_ENDPOINT}</code> and simulate a processing delay.</p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={triggerFetch}
                    className="flex items-center justify-center gap-3 px-5 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                    disabled={fetching}
                  >
                    {fetching ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <span>Fetch Test Endpoint</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setResult(null);
                      setFetchError(null);
                    }}
                    className="px-4 py-2 bg-gray-700 rounded-lg font-semibold"
                  >
                    Clear
                  </button>
                </div>

                <div className="w-full max-w-2xl">
                  {fetching && <p className="text-gray-400">Waiting for the endpoint to respond...</p>}
                  {result && (
                    <pre className="mt-4 p-4 bg-gray-900 rounded text-sm text-green-300 overflow-auto">{result}</pre>
                  )}
                  {fetchError && (
                    <div className="mt-4 p-4 bg-red-900 rounded text-sm text-red-200">Error: {fetchError}</div>
                  )}
                  <p className="mt-4 text-xs text-gray-500">Tip: Run <code className="text-xs">npm run loader-endpoint</code> in the project root to start the test API at port 4000.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Button Loading State */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Button Loading State</h2>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div className="flex gap-4">
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-all">
                  <LoadingSpinner size="sm" />
                  <span>Downloading...</span>
                </button>
                <button className="px-6 py-3 bg-gray-700 rounded-lg font-semibold">
                  Normal Button
                </button>
              </div>
            </div>
          </section>

          {/* Multiple Loaders */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Multiple Loaders</h2>
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-400">Medium Size</p>
                </div>
                <div className="flex flex-col items-center">
                  <LoadingSpinner size="sm" />
                  <p className="mt-4 text-gray-400">Small Size</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoaderTestPage;
