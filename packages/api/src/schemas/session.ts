import { z } from 'zod';

/**
 * Session response schema
 */
export const SessionSchema = z.object({
  id: z.string(),
  track: z.string(),
  sessionType: z.enum(['practice', 'qualifying', 'race', 'time_trial', 'unknown']),
  weather: z.enum(['clear', 'light_cloud', 'overcast', 'light_rain', 'heavy_rain', 'storm']),
  trackTemp: z.number(),
  airTemp: z.number(),
  startedAt: z.number(),
  endedAt: z.number().nullable(),
});

/**
 * List sessions response
 */
export const ListSessionsResponseSchema = z.object({
  sessions: z.array(SessionSchema),
});

/**
 * Get session response
 */
export const GetSessionResponseSchema = z.object({
  session: SessionSchema,
  laps: z.array(
    z.object({
      id: z.number(),
      lapNumber: z.number(),
      lapTimeMs: z.number().nullable(),
      isValid: z.boolean(),
      tireCompound: z.string().nullable(),
    })
  ),
});

export type SessionResponse = z.infer<typeof SessionSchema>;
export type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;
export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>;
