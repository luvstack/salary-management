import http from 'http';
import logger from 'jet-logger';

import EnvVars from './common/constants/env';
import { connectDb, disconnectDb } from './db';
import server from './server';
import { initAssociations } from './models/associations';

const SERVER_START_MESSAGE =
  'Express server started on port: ' + EnvVars.Port.toString();

async function shutdown(
  httpServer: http.Server,
  signal: string,
): Promise<void> {
  logger.info(`${signal} received, shutting down gracefully`);

  // 1. Stop accepting new HTTP connections.
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  logger.info('HTTP server closed');

  // 3. Close DB.
  await disconnectDb();

  logger.info('Shutdown complete');
  process.exit(0);
}

async function bootstrap(): Promise<void> {
  try {
    /*
     * Register Sequelize model associations.
     *
     * This does not connect to PostgreSQL.
     * It only registers ORM relationship metadata.
     */

    initAssociations();
    await connectDb();
  } catch (err) {
    logger.err('Failed to initialize infrastructure');
    logger.err(err as Error);
    process.exit(1);
  }

  const httpServer = server.listen(EnvVars.Port, () => {
    logger.info(SERVER_START_MESSAGE);
  });

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => void shutdown(httpServer, signal));
  }
}

void bootstrap();
