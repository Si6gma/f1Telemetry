/**
 * Domain types for Lap entities
 * These are app-level types derived from parsed F1 23 packets
 */

/**
 * A completed lap
 */
export interface Lap {
  /** Unique lap identifier */
  id: number;
  /** Session this lap belongs to */
  sessionId: string;
  /** Lap number within the session */
  lapNumber: number;
  /** Lap time in milliseconds */
  lapTimeMs: number;
  /** Sector 1 time in milliseconds */
  sector1Ms: number;
  /** Sector 2 time in milliseconds */
  sector2Ms: number;
  /** Sector 3 time in milliseconds */
  sector3Ms: number;
  /** Whether this lap is valid (no track cuts) */
  isValid: boolean;
  /** Tyre compound used */
  tireCompound: string;
  /** Fuel load at start of lap (kg) */
  fuelLoad: number;
  /** Timestamp when lap was completed */
  completedAt: number;
}

/**
 * Lap summary for listing (without full telemetry)
 */
export interface LapSummary {
  id: number;
  lapNumber: number;
  lapTimeMs: number;
  isValid: boolean;
  tireCompound: string;
}

/**
 * Two laps being compared
 */
export interface LapComparison {
  /** First lap (reference) */
  lapA: Lap;
  /** Second lap (comparison) */
  lapB: Lap;
  /** Interpolated telemetry for lap A (aligned by distance) */
  telemetryA: TelemetryPoint[];
  /** Interpolated telemetry for lap B (aligned by distance) */
  telemetryB: TelemetryPoint[];
  /** Delta at each point (positive = B is slower) */
  deltaMs: number[];
}

import type { TelemetryPoint } from './telemetry.js';
