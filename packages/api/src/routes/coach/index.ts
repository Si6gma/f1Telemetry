import { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

const CoachRequestSchema = z.object({
  lapId: z.number(),
});

const CoachResponseSchema = z.object({
  analysis: z.string(),
  recommendations: z.array(z.string()),
  ratings: z.object({
    braking: z.number(),
    throttle: z.number(),
    consistency: z.number(),
    overall: z.number(),
  }),
});

/**
 * Register coach routes
 */
export async function coachRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /coach/analyse - Analyse a lap using AI coach
  fastify.post('/analyse', {
    schema: {
      body: zodToJsonSchema(CoachRequestSchema),
      response: {
        200: zodToJsonSchema(CoachResponseSchema),
      },
    },
    handler: async (request) => {
      const { lapId } = request.body as { lapId: number };

      // TODO: Integrate with Claude API
      // For now, return mock analysis
      return {
        analysis:
          `Analysis for lap ${lapId}:\n\n` +
          'Your lap was generally clean with good consistency. ' +
          'However, there are a few areas where time was lost:\n\n' +
          '1. Turn 3: You braked about 10m too early, losing ~0.15s\n' +
          '2. Turn 7: Late on throttle, losing ~0.2s\n' +
          '3. Final sector: Good pace, maintaining consistent lap times.',
        recommendations: [
          'Delay braking at Turn 3 by 10 meters',
          'Apply throttle earlier out of Turn 7',
          'Focus on maintaining consistent racing lines',
          'Tire temperatures look good - continue current management',
        ],
        ratings: {
          braking: 7,
          throttle: 6,
          consistency: 8,
          overall: 7,
        },
      };
    },
  });
}

export default coachRoutes;
