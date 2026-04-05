import { FastifyInstance } from 'fastify';
import { ListSessionsResponseSchema, GetSessionResponseSchema } from '../../schemas/session.js';

/**
 * Register session routes
 */
export async function sessionRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /sessions - List all sessions
  fastify.get('/', {
    schema: {
      response: {
        200: ListSessionsResponseSchema,
      },
    },
    handler: async () => {
      // TODO: Fetch from database
      // For now, return mock data
      return {
        sessions: [
          {
            id: 'mock-session-1',
            track: 'Silverstone',
            sessionType: 'practice',
            weather: 'clear',
            trackTemp: 28,
            airTemp: 22,
            startedAt: Date.now() - 3600000,
            endedAt: null,
          },
        ],
      };
    },
  });

  // GET /sessions/:id - Get session details with laps
  fastify.get('/:id', {
    schema: {
      response: {
        200: GetSessionResponseSchema,
      },
    },
    handler: async (request) => {
      const { id } = request.params as { id: string };
      
      // TODO: Fetch from database
      return {
        session: {
          id,
          track: 'Silverstone',
          sessionType: 'practice',
          weather: 'clear',
          trackTemp: 28,
          airTemp: 22,
          startedAt: Date.now() - 3600000,
          endedAt: null,
        },
        laps: [
          { id: 1, lapNumber: 1, lapTimeMs: 95000, isValid: true, tireCompound: 'C3' },
          { id: 2, lapNumber: 2, lapTimeMs: 92000, isValid: true, tireCompound: 'C3' },
        ],
      };
    },
  });
}

export default sessionRoutes;
