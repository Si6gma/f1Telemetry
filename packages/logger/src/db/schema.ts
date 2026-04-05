import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * Sessions table - one row per session
 */
export const sessions = sqliteTable('sessions', {
  /** Unique session identifier (from F1 23 sessionUID) */
  id: text('id').primaryKey(),
  /** Track ID number */
  trackId: integer('track_id').notNull(),
  /** Track name */
  track: text('track').notNull(),
  /** Session type */
  sessionType: text('session_type').notNull(),
  /** Weather condition */
  weather: text('weather').notNull(),
  /** Track temperature in Celsius */
  trackTemp: integer('track_temp').notNull(),
  /** Air temperature in Celsius */
  airTemp: integer('air_temp').notNull(),
  /** Session start timestamp (unix milliseconds) */
  startedAt: integer('started_at').notNull(),
  /** Session end timestamp (null if ongoing) */
  endedAt: integer('ended_at'),
});

/**
 * Laps table - one row per completed lap
 */
export const laps = sqliteTable('laps', {
  /** Unique lap identifier */
  id: integer('id').primaryKey({ autoIncrement: true }),
  /** Session this lap belongs to */
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id),
  /** Lap number within the session */
  lapNumber: integer('lap_number').notNull(),
  /** Lap time in milliseconds */
  lapTimeMs: integer('lap_time_ms'),
  /** Sector 1 time in milliseconds */
  sector1Ms: integer('sector1_ms'),
  /** Sector 2 time in milliseconds */
  sector2Ms: integer('sector2_ms'),
  /** Sector 3 time in milliseconds */
  sector3Ms: integer('sector3_ms'),
  /** Whether this lap is valid (no track cuts) */
  isValid: integer('is_valid', { mode: 'boolean' }).notNull(),
  /** Tyre compound used */
  tireCompound: text('tire_compound'),
  /** Fuel load at start of lap in kg */
  fuelLoad: real('fuel_load'),
  /** Timestamp when lap was completed */
  completedAt: integer('completed_at'),
});

/**
 * Telemetry table - high-frequency data points
 */
export const telemetry = sqliteTable('telemetry', {
  /** Unique identifier */
  id: integer('id').primaryKey({ autoIncrement: true }),
  /** Lap this telemetry belongs to */
  lapId: integer('lap_id')
    .notNull()
    .references(() => laps.id),
  /** Distance around the lap in meters */
  distanceM: real('distance_m').notNull(),
  /** Speed in km/h */
  speedKph: real('speed_kph').notNull(),
  /** Throttle input (0.0 - 1.0) */
  throttle: real('throttle').notNull(),
  /** Brake input (0.0 - 1.0) */
  brake: real('brake').notNull(),
  /** Gear selected */
  gear: integer('gear').notNull(),
  /** Engine RPM */
  rpm: integer('rpm').notNull(),
  /** Steering input (-1.0 - 1.0) */
  steering: real('steering').notNull(),
  /** DRS active (0 or 1) */
  drs: integer('drs').notNull(),
  /** Tire temperature front left (Celsius) */
  tireTempFL: real('tire_temp_fl'),
  /** Tire temperature front right (Celsius) */
  tireTempFR: real('tire_temp_fr'),
  /** Tire temperature rear left (Celsius) */
  tireTempRL: real('tire_temp_rl'),
  /** Tire temperature rear right (Celsius) */
  tireTempRR: real('tire_temp_rr'),
  /** ERS energy deployed this lap (percentage) */
  ersDeployed: real('ers_deployed'),
  /** Timestamp of this data point */
  timestamp: integer('timestamp').notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Lap = typeof laps.$inferSelect;
export type NewLap = typeof laps.$inferInsert;
export type Telemetry = typeof telemetry.$inferSelect;
export type NewTelemetry = typeof telemetry.$inferInsert;
