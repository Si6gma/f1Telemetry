/**
 * Car Telemetry Packet (ID: 6)
 * Contains telemetry data for all 22 cars
 */

export interface CarTelemetryData {
  /** Speed in km/h */
  speed: number;
  /** Throttle input (0.0 - 1.0) */
  throttle: number;
  /** Steering input (-1.0 - 1.0, full lock) */
  steer: number;
  /** Brake input (0.0 - 1.0) */
  brake: number;
  /** Clutch input (0 - 100) */
  clutch: number;
  /** Gear selected (-1 = reverse, 0 = neutral, 1-8 = forward gears) */
  gear: number;
  /** Engine RPM */
  engineRPM: number;
  /** DRS state (0 = off, 1 = on) */
  drs: number;
  /** Rev lights indicator (percentage, 0-100) */
  revLightsPercent: number;
  /** Bit-mask representing rev lights */
  revLightsBitValue: number;
  /** Brake temperature for each wheel (RL, RR, FL, FR) in Celsius */
  brakesTemperature: [number, number, number, number];
  /** Tire surface temperature for each wheel (RL, RR, FL, FR) in Celsius */
  tyresSurfaceTemperature: [number, number, number, number];
  /** Tire inner temperature for each wheel (RL, RR, FL, FR) in Celsius */
  tyresInnerTemperature: [number, number, number, number];
  /** Engine temperature in Celsius */
  engineTemperature: number;
  /** Tire pressure for each wheel (RL, RR, FL, FR) in PSI */
  tyresPressure: [number, number, number, number];
  /** Surface type for each wheel (RL, RR, FL, FR) - see SurfaceType enum */
  surfaceType: [number, number, number, number];
}

export interface CarTelemetryPacket {
  /** Telemetry data for all cars */
  carTelemetryData: CarTelemetryData[];
  /** Index of the car with the MFD open (255 if none) */
  mfdPanelIndex: number;
  /** Secondary player MFD panel index */
  mfdPanelIndexSecondaryPlayer: number;
  /** Suggested gear for the player (0 if none) */
  suggestedGear: number;
}

/** Surface type identifiers */
export enum SurfaceType {
  Tarmac = 0,
  RumbleStrip = 1,
  Concrete = 2,
  Rock = 3,
  Gravel = 4,
  Mud = 5,
  Sand = 6,
  Grass = 7,
  Water = 8,
  Cobblestone = 9,
  Metal = 10,
  Ridged = 11,
}
