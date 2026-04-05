import { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  GetLapResponseSchema,
  CompareLapsRequestSchema,
  CompareLapsResponseSchema,
  type CompareLapsRequest,
} from '../../schemas/lap.js';

/**
 * Generate mock telemetry data for a lap
 */
function generateMockTelemetry(distanceM: number): {
  distanceM: number;
  speedKph: number;
  throttle: number;
  brake: number;
  gear: number;
  rpm: number;
  steering: number;
  drs: number;
  tireTempFL: number;
  tireTempFR: number;
  tireTempRL: number;
  tireTempRR: number;
  ersDeployed: number;
} {
  return {
    distanceM,
    speedKph: 200 + Math.sin(distanceM / 100) * 100,
    throttle: 0.8,
    brake: 0,
    gear: 6,
    rpm: 9000 + Math.sin(distanceM / 50) * 2000,
    steering: Math.sin(distanceM / 200) * 0.3,
    drs: distanceM > 1000 && distanceM < 2000 ? 1 : 0,
    tireTempFL: 85,
    tireTempFR: 86,
    tireTempRL: 90,
    tireTempRR: 91,
    ersDeployed: 50,
  };
}

/**
 * Register lap routes
 */
export async function lapRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /laps/:id - Get lap with telemetry
  fastify.get('/:id', {
    schema: {
      response: {
        200: zodToJsonSchema(GetLapResponseSchema),
      },
    },
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const lapId = parseInt(id, 10);

      // TODO: Fetch from database
      // Generate mock telemetry data (one point every 10 meters)
      const telemetry = [];
      for (let d = 0; d < 5000; d += 10) {
        telemetry.push(generateMockTelemetry(d));
      }

      return {
        lap: {
          id: lapId,
          sessionId: 'mock-session-1',
          lapNumber: lapId,
          lapTimeMs: 90000 + lapId * 1000,
          sector1Ms: 28000,
          sector2Ms: 32000,
          sector3Ms: 30000 + lapId * 1000,
          isValid: true,
          tireCompound: 'C3',
          fuelLoad: 50,
          completedAt: Date.now(),
        },
        telemetry,
      };
    },
  });

  // GET /laps/compare?a=:id&b=:id - Compare two laps
  fastify.get('/compare', {
    schema: {
      querystring: zodToJsonSchema(CompareLapsRequestSchema),
      response: {
        200: zodToJsonSchema(CompareLapsResponseSchema),
      },
    },
    handler: async (request) => {
      const { a, b } = request.query as CompareLapsRequest;

      // TODO: Fetch from database and interpolate
      // Generate mock comparison data
      const telemetryA = [];
      const telemetryB = [];
      const deltaMs = [];

      for (let d = 0; d < 5000; d += 10) {
        telemetryA.push(generateMockTelemetry(d));
        telemetryB.push(generateMockTelemetry(d));
        // Simulate B being slightly slower
        deltaMs.push(Math.sin(d / 500) * 500);
      }

      return {
        lapA: {
          id: a,
          sessionId: 'mock-session-1',
          lapNumber: 1,
          lapTimeMs: 90000,
          sector1Ms: 28000,
          sector2Ms: 32000,
          sector3Ms: 30000,
          isValid: true,
          tireCompound: 'C3',
          fuelLoad: 50,
          completedAt: Date.now(),
        },
        lapB: {
          id: b,
          sessionId: 'mock-session-1',
          lapNumber: 2,
          lapTimeMs: 90500,
          sector1Ms: 28100,
          sector2Ms: 32200,
          sector3Ms: 30200,
          isValid: true,
          tireCompound: 'C3',
          fuelLoad: 48,
          completedAt: Date.now(),
        },
        telemetryA,
        telemetryB,
        deltaMs,
      };
    },
  });
}

export default lapRoutes;
