import { pino } from 'pino';
import type { Logger } from 'pino';

/**
 * Create a logger instance
 */
export function createLogger(name: string): Logger {
  const isDev = process.env.NODE_ENV !== 'production';

  return pino({
    name,
    level: process.env.LOG_LEVEL ?? 'info',
    ...(isDev && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }),
  });
}

export type { Logger } from 'pino';
