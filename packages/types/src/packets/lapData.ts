/**
 * Lap Data Packet (ID: 2)
 * Contains lap data for all 22 cars
 */

export interface LapData {
  /** Last lap time in milliseconds */
  lastLapTimeInMS: number;
  /** Current lap time in milliseconds */
  currentLapTimeInMS: number;
  /** Sector 1 time in milliseconds */
  sector1TimeInMS: number;
  /** Sector 1 time minutes component */
  sector1TimeMinutes: number;
  /** Sector 2 time in milliseconds */
  sector2TimeInMS: number;
  /** Sector 2 time minutes component */
  sector2TimeMinutes: number;
  /** Delta to car in front in milliseconds */
  deltaToCarInFrontInMS: number;
  /** Delta to race leader in milliseconds */
  deltaToRaceLeaderInMS: number;
  /** Distance car is around current lap in metres */
  lapDistance: number;
  /** Total distance travelled in session in metres */
  totalDistance: number;
  /** Delta in seconds for safety car */
  safetyCarDelta: number;
  /** Car race position */
  carPosition: number;
  /** Current lap number */
  currentLapNum: number;
  /** Pit status (0 = none, 1 = pitting, 2 = in pit area) */
  pitStatus: number;
  /** Number of pit stops taken */
  numPitStops: number;
  /** Sector (0 = sector1, 1 = sector2, 2 = sector3) */
  sector: number;
  /** Current lap invalid (0 = valid, 1 = invalid) */
  currentLapInvalid: number;
  /** Accumulated time penalties in seconds */
  penalties: number;
  /** Accumulated number of warnings issued */
  totalWarnings: number;
  /** Accumulated corner cutting warnings issued */
  cornerCuttingWarnings: number;
  /** Number of drive-through penalties left to serve */
  numUnservedDriveThroughPens: number;
  /** Number of stop-go penalties left to serve */
  numUnservedStopGoPens: number;
  /** Grid position the vehicle started the race in */
  gridPosition: number;
  /** Driver status (0 = in garage, 1 = flying lap, 2 = in lap, 3 = out lap, 4 = on track) */
  driverStatus: number;
  /** Result status (0 = invalid, 1 = inactive, 2 = active, 3 = finished, 4 = disqualified, etc) */
  resultStatus: number;
  /** Pit lane timer active (0 = inactive, 1 = active) */
  pitLaneTimerActive: number;
  /** If timer is active, the current time spent in pit lane in milliseconds */
  pitLaneTimeInLaneInMS: number;
  /** Time of the actual pit stop in milliseconds */
  pitStopTimerInMS: number;
  /** Whether the car should serve a penalty at this stop */
  pitStopShouldServePen: number;
}

export interface LapDataPacket {
  /** Lap data for all cars */
  lapData: LapData[];
  /** Time trial opponent's active lap time */
  timeTrialPBCarIdx: number;
  /** Time trial personal best car index */
  timeTrialRivalCarIdx: number;
}

/** Driver status identifiers */
export enum DriverStatus {
  InGarage = 0,
  FlyingLap = 1,
  InLap = 2,
  OutLap = 3,
  OnTrack = 4,
}

/** Result status identifiers */
export enum ResultStatus {
  Invalid = 0,
  Inactive = 1,
  Active = 2,
  Finished = 3,
  Disqualified = 4,
  NotClassified = 5,
  Retired = 6,
}
