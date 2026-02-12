import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const apiMiddleware = async (req: any, res: any, next: any) => {
  if (req.url === '/api/quests') {
    try {
      const { getActiveQuests } = await import('./services/questService');
      const quests = await getActiveQuests();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(quests));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (e as Error).message }));
    }
    return;
  }
  if (req.url === '/api/stats') {
    try {
      const { loadQuests } = await import('./services/questService');
      const quests = await loadQuests();
      const totalParticipants = quests.reduce((acc: number, q: any) => acc + (q.completedCount || 0), 0);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        questsDeployed: quests.length,
        totalParticipants: 1452 + totalParticipants,
        rewardsDistributed: 842 + totalParticipants,
        walletBalance: '1.42 ETH',
        dailyBudgetUsed: '0.04 / 0.1 ETH'
      }));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (e as Error).message }));
    }
    return;
  }
  next();
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
    },
    preview: {
      allowedHosts: true,
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-middleware',
        configureServer(server) {
          server.middlewares.use(apiMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use(apiMiddleware);
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
