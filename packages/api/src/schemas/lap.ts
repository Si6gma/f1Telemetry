import { z } from 'zod';

/**
 * Lap response schema
 */
export const LapSchema = z.object({
  id: z.number(),
  sessionId: z.string(),
  lapNumber: z.number(),
  lapTimeMs: z.number().nullable(),
  sector1Ms: z.number().nullable(),
  sector2Ms: z.number().nullable(),
  sector3Ms: z.number().nullable(),
  isValid: z.boolean(),
  tireCompound: z.string().nullable(),
  fuelLoad: z.number().nullable(),
  completedAt: z.number().nullable(),
});

/**
 * Telemetry point schema
 */
export const TelemetryPointSchema = z.object({
  distanceM: z.number(),
  speedKph: z.number(),
  throttle: z.number(),
  brake: z.number(),
  gear: z.number(),
  rpm: z.number(),
  steering: z.number(),
  drs: z.number(),
  tireTempFL: z.number().nullable(),
  tireTempFR: z.number().nullable(),
  tireTempRL: z.number().nullable(),
  tireTempRR: z.number().nullable(),
  ersDeployed: z.number().nullable(),
});

/**
 * Get lap response
 */
export const GetLapResponseSchema = z.object({
  lap: LapSchema,
  telemetry: z.array(TelemetryPointSchema),
});

/**
 * Compare laps request
 */
export const CompareLapsRequestSchema = z.object({
  a: z.coerce.number(),
  b: z.coerce.number(),
});

/**
 * Compare laps response
 */
export const CompareLapsResponseSchema = z.object({
  lapA: LapSchema,
  lapB: LapSchema,
  telemetryA: z.array(TelemetryPointSchema),
  telemetryB: z.array(TelemetryPointSchema),
  deltaMs: z.array(z.number()),
});

export type LapResponse = z.infer<typeof LapSchema>;
export type TelemetryPointResponse = z.infer<typeof TelemetryPointSchema>;
export type GetLapResponse = z.infer<typeof GetLapResponseSchema>;
export type CompareLapsRequest = z.infer<typeof CompareLapsRequestSchema>;
export type CompareLapsResponse = z.infer<typeof CompareLapsResponseSchema>;
