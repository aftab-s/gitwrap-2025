import React from 'react';

const TokenWarningBanner: React.FC = () => {
    return (
        <div className="bg-yellow-500/20 border-b-2 border-yellow-500 text-yellow-200 p-3 text-center text-sm sticky top-0 z-50">
            <strong>Note:</strong> No <code>GITHUB_APP_TOKEN</code> was found. The app is making unauthenticated requests to GitHub and may hit a rate limit. For a stable experience, please provide a token in your environment.
        </div>
    );
};

export default TokenWarningBanner;