/**
 * Domain types for Session entities
 * These are app-level types derived from parsed F1 23 packets
 */

/**
 * A racing session (practice, qualifying, race, etc.)
 */
export interface Session {
  /** Unique session identifier (from F1 23 sessionUID) */
  id: string;
  /** Track name */
  track: string;
  /** Session type: practice, quali, race, etc. */
  type: SessionType;
  /** Weather condition */
  weather: Weather;
  /** Track temperature in Celsius */
  trackTemp: number;
  /** Air temperature in Celsius */
  airTemp: number;
  /** Session start timestamp */
  startedAt: number;
  /** Session end timestamp (null if ongoing) */
  endedAt: number | null;
}

/** Session type as stored in the database */
export type SessionType =
  | 'practice'
  | 'qualifying'
  | 'race'
  | 'time_trial'
  | 'unknown';

/** Weather condition as stored in the database */
export type Weather =
  | 'clear'
  | 'light_cloud'
  | 'overcast'
  | 'light_rain'
  | 'heavy_rain'
  | 'storm';

/**
 * Track information
 */
export interface TrackInfo {
  /** Track ID from F1 23 */
  id: number;
  /** Human-readable name */
  name: string;
  /** Country/location */
  location: string;
  /** Track length in meters */
  length: number;
}
