import fastify from 'fastify';
import cors from '@fastify/cors';
import { createLogger } from './utils/logger.js';
import { sessionRoutes } from './routes/sessions/index.js';
import { lapRoutes } from './routes/laps/index.js';
import { coachRoutes } from './routes/coach/index.js';

const logger = createLogger('api');

/**
 * Create and configure the Fastify server
 */
export async function createServer() {
  const app = fastify({
    logger: false, // Disable default logger, use our own
  });

  // Register CORS
  await app.register(cors, {
    origin: true,
  });

  // Register routes
  await app.register(sessionRoutes, { prefix: '/sessions' });
  await app.register(lapRoutes, { prefix: '/laps' });
  await app.register(coachRoutes, { prefix: '/coach' });

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

/**
 * Main entry point
 */
async function main() {
  const app = await createServer();
  const port = parseInt(process.env.API_PORT ?? '3001', 10);

  try {
    await app.listen({ port, host: '0.0.0.0' });
    logger.info({ port }, 'API server started');
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createLogger };
