import { pino } from 'pino';
import type { Logger } from 'pino';

/**
 * Create a logger instance
 */
export function createLogger(name: string): Logger {
  return pino({
    name,
    level: process.env.LOG_LEVEL ?? 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
  });
}

export type { Logger } from 'pino';
