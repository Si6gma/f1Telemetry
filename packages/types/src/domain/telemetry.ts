/**
 * Domain types for Telemetry data
 * These are app-level types derived from parsed F1 23 packets
 */

/**
 * A single telemetry point (from one UDP packet)
 */
export interface TelemetryPoint {
  /** Distance around the lap in meters */
  distanceM: number;
  /** Speed in km/h */
  speedKph: number;
  /** Throttle input (0.0 - 1.0) */
  throttle: number;
  /** Brake input (0.0 - 1.0) */
  brake: number;
  /** Gear selected */
  gear: number;
  /** Engine RPM */
  rpm: number;
  /** Steering input (-1.0 - 1.0) */
  steering: number;
  /** DRS active (0 or 1) */
  drs: number;
  /** Tire temperature front left (Celsius) */
  tireTempFL: number;
  /** Tire temperature front right (Celsius) */
  tireTempFR: number;
  /** Tire temperature rear left (Celsius) */
  tireTempRL: number;
  /** Tire temperature rear right (Celsius) */
  tireTempRR: number;
  /** ERS energy deployed this lap (percentage) */
  ersDeployed: number;
  /** Lap time at this point (milliseconds) */
  lapTimeMs: number;
}

/**
 * Full telemetry data for a lap
 */
export interface LapTelemetry {
  /** Lap identifier */
  lapId: number;
  /** Session identifier */
  sessionId: string;
  /** Array of telemetry points in order of distance */
  points: TelemetryPoint[];
}

/**
 * Live telemetry snapshot (for real-time dashboard)
 */
export interface LiveTelemetry {
  /** Current speed */
  speed: number;
  /** Current throttle input */
  throttle: number;
  /** Current brake input */
  brake: number;
  /** Current gear */
  gear: number;
  /** Current RPM */
  rpm: number;
  /** Current steering */
  steering: number;
  /** DRS active */
  drs: boolean;
  /** Current lap time in milliseconds */
  currentLapTimeMs: number;
  /** Current lap number */
  lapNumber: number;
  /** Position in race */
  position: number;
  /** Distance around lap in meters */
  lapDistance: number;
  /** Tire temperatures */
  tireTemps: {
    fl: number;
    fr: number;
    rl: number;
    rr: number;
  };
  /** ERS deploy mode */
  ersMode: number;
  /** Delta to best lap in milliseconds (negative = faster) */
  deltaToBestLapMs: number | null;
  /** Current sector (0, 1, or 2) */
  currentSector: number;
  /** Sector times in milliseconds */
  sectorTimesMs: [number | null, number | null, number | null];
}

/**
 * Track position data (for track map)
 */
export interface TrackPosition {
  /** X coordinate in world space */
  x: number;
  /** Y coordinate in world space (elevation) */
  y: number;
  /** Z coordinate in world space */
  z: number;
  /** Speed at this position */
  speed: number;
}
