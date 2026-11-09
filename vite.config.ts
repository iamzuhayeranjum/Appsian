import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import leadHandler from './api/lead.ts';

function leadDevPlugin(): Plugin {
  const middleware = (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];
    if (url === '/api/lead') {
      const origin = req.headers['origin'] || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-forwarded-for');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      if (req.method === 'POST') {
        let raw = '';
        req.on('data', (chunk: any) => {
          raw += chunk;
        });
        req.on('end', async () => {
          try {
            req.body = JSON.parse(raw);
          } catch {
            req.body = raw;
          }

          res.status = (code: number) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store');
            res.end(JSON.stringify(data));
            return res;
          };

          if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            try {
              await leadHandler(req, res);
            } catch (err: any) {
              console.error('[lead dev] Handler error:', err);
              res.status(500).json({ ok: false, error: 'Could not deliver the message' });
            }
          } else {
            // Dev / Preview mode without configured Telegram credentials:
            // Validate input format and return simulated 200 { ok: true }
            const body = req.body || {};
            if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
              return res.status(400).json({ ok: false, error: 'Invalid request' });
            }
            console.log('[Dev Server /api/lead] Form submitted in preview mode:');
            console.log(`  Source: ${body.source}, Name: ${body.name || '(none)'}, Email: ${body.email}`);
            console.log('  (In production on Vercel, this delivers directly to your Telegram bot)');
            res.status(200).json({ ok: true, devMode: true });
          }
        });
        return;
      }
    }
    next();
  };

  return {
    name: 'lead-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), leadDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: true,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      strictPort: false,
      cors: true,
      allowedHosts: true as const,
    },
  };
});
