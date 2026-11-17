import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only: serves the Vercel functions in /api from the Vite dev server, so `npm run dev` gives you
 * the full app (frontend + backend) on one port. In production Vercel runs the same files natively.
 *
 * Each function exports web-standard handlers: `export function GET(request: Request): Response`.
 */
function devApi(): Plugin {
  return {
    name: 'gitwrap-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
        if (!url.pathname.startsWith('/api/')) return next();

        // /api/auth/login → api/auth/login.ts  (files/folders starting with "_" are private helpers)
        const route = url.pathname.replace(/\/+$/, '');
        const file = path.join(server.config.root, `${route}.ts`);
        if (route.includes('/_') || route.includes('..') || !fs.existsSync(file)) {
          res.statusCode = 404;
          return res.end('Not found');
        }

        try {
          const mod = await server.ssrLoadModule(file);
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end('Method not allowed');
          }

          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
          }
          const response: Response = await handler(new Request(url, { method: req.method, headers }));

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            if (key !== 'set-cookie') res.setHeader(key, value);
          });
          const cookies = response.headers.getSetCookie();
          if (cookies.length) res.setHeader('set-cookie', cookies);
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.ssrFixStacktrace(err as Error);
          console.error(`[api] ${url.pathname} failed:`, err);
          res.statusCode = 500;
          res.end('Internal error');
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make server-side secrets from .env.local available to the /api handlers in dev.
  // They are NOT exposed to browser code: only VITE_-prefixed variables are, and this app has none.
  const env = loadEnv(mode, '.', '');
  for (const [k, v] of Object.entries(env)) {
    process.env[k] ??= v;
  }

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), devApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
