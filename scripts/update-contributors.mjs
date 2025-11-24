#!/usr/bin/env node
/**
 * Fetches repository contributors from GitHub API and writes to public/contributors.json
 * Usage: node scripts/update-contributors.mjs [--token YOUR_TOKEN] [--repo owner/repo]
 * 
 * Environment variables:
 * - VITE_GITHUB_APP_TOKEN: GitHub API token (fallback if --token not provided)
 * - VITE_GITHUB_REPOSITORY: Repository (fallback if --repo not provided)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
let token = process.env.VITE_GITHUB_APP_TOKEN || '';
let repo = process.env.VITE_GITHUB_REPOSITORY || 'aftab-s/gitwrap-2025';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--token' && i + 1 < args.length) {
    token = args[i + 1];
  } else if (args[i] === '--repo' && i + 1 < args.length) {
    repo = args[i + 1];
  }
}

console.log(`📦 Fetching contributors for ${repo}...`);

if (!token) {
  console.warn('⚠️  No GitHub token provided. API rate limits may apply.');
  console.warn('   Set VITE_GITHUB_APP_TOKEN or pass --token YOUR_TOKEN');
}

/**
 * Fetch data from GitHub API with optional authentication
 */
function fetchGitHub(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'GitWrap-Contributors-Updater/1.0',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `token ${token}`;
    }

    const finalHeaders = { ...defaultHeaders, ...headers };

    https.get(url, { headers: finalHeaders }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse GitHub response: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch all contributors (handle pagination)
 */
async function fetchAllContributors(repo, perPage = 100) {
  const contributors = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `https://api.github.com/repos/${repo}/contributors?per_page=${perPage}&page=${page}`;
      const data = await fetchGitHub(url);

      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        break;
      }

      contributors.push(...data);

      if (data.length < perPage) {
        hasMore = false;
      }

      page++;
    } catch (err) {
      console.error(`❌ Error fetching page ${page}:`, err.message);
      hasMore = false;
      if (contributors.length === 0) {
        throw err; // Re-throw if no data collected yet
      }
    }
  }

  return contributors;
}

/**
 * Main execution
 */
async function main() {
  try {
    const contributors = await fetchAllContributors(repo);

    if (contributors.length === 0) {
      throw new Error('No contributors found or API returned empty list');
    }

    // Write to public/contributors.json
    const outputPath = path.join(__dirname, '../public/contributors.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(contributors, null, 2));

    console.log(`✅ Successfully updated ${outputPath}`);
    console.log(`📊 Total contributors: ${contributors.length}`);
    console.log(`   Top contributors:`);

    contributors.slice(0, 5).forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.login} (${c.contributions} contributions)`);
    });

  } catch (err) {
    console.error('❌ Failed to update contributors:', err.message);
    process.exit(1);
  }
}

main();
