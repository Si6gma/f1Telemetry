/**
 * Session Packet (ID: 1)
 * Contains session information and weather data
 */

export interface MarshalZone {
  /** Fraction (0..1) of way through the lap the marshal zone starts */
  zoneStart: number;
  /** -1 = invalid/unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow, 4 = red */
  zoneFlag: number;
}

export interface WeatherForecastSample {
  /** Session type (0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, etc) */
  sessionType: number;
  /** Time in minutes the forecast is for */
  timeOffset: number;
  /** Weather (0 = clear, 1 = light cloud, 2 = overcast, etc) */
  weather: number;
  /** Track temperature in celsius */
  trackTemperature: number;
  /** Track temperature change (0 = up, 1 = down, 2 = no change) */
  trackTemperatureChange: number;
  /** Air temperature in celsius */
  airTemperature: number;
  /** Air temperature change (0 = up, 1 = down, 2 = no change) */
  airTemperatureChange: number;
  /** Rain percentage (0-100) */
  rainPercentage: number;
}

export interface SessionPacket {
  /** Weather (0 = clear, 1 = light cloud, 2 = overcast, 3 = light rain, etc) */
  weather: number;
  /** Track temperature in celsius */
  trackTemperature: number;
  /** Air temperature in celsius */
  airTemperature: number;
  /** Total number of laps in this race */
  totalLaps: number;
  /** Track length in metres */
  trackLength: number;
  /** Session type (0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, 5 = Q1, etc) */
  sessionType: number;
  /** Track ID (-1 for unknown) */
  trackId: number;
  /** Formula type (0 = F1 Modern, 1 = F1 Classic, 2 = F2, etc) */
  formula: number;
  /** Time left in session in seconds */
  sessionTimeLeft: number;
  /** Session duration in seconds */
  sessionDuration: number;
  /** Pit speed limit in km/h */
  pitSpeedLimit: number;
  /** Whether the game is paused */
  gamePaused: number;
  /** Whether the player is spectating */
  isSpectating: number;
  /** Index of the car being spectated */
  spectatorCarIndex: number;
  /** Whether SLI Pro is supported */
  sliProNativeSupport: number;
  /** Number of marshal zones to follow */
  numMarshalZones: number;
  /** Marshal zones - max of 21 */
  marshalZones: MarshalZone[];
  /** Safety car status (0 = no safety car, 1 = full safety car, 2 = virtual safety car) */
  safetyCarStatus: number;
  /** Whether the session is networked */
  networkGame: number;
  /** Number of weather samples to follow */
  numWeatherForecastSamples: number;
  /** Weather forecast samples - max of 64 */
  weatherForecastSamples: WeatherForecastSample[];
  /** Forecast accuracy (0 = Perfect, 1 = Approximate) */
  forecastAccuracy: number;
  /** AI difficulty level (0-110) */
  aiDifficulty: number;
  /** Season link identifier */
  seasonLinkIdentifier: number;
  /** Weekend link identifier */
  weekendLinkIdentifier: number;
  /** Session link identifier */
  sessionLinkIdentifier: number;
  /** Pit stop window ideal lap */
  pitStopWindowIdealLap: number;
  /** Pit stop window latest lap */
  pitStopWindowLatestLap: number;
  /** Pit stop rejoin position */
  pitStopRejoinPosition: number;
  /** Steering assist (0 = off, 1 = on) */
  steeringAssist: number;
  /** Braking assist (0 = off, 1 = low, 2 = medium, 3 = high) */
  brakingAssist: number;
  /** Gearbox assist (0 = manual, 1 = manual & suggested, 2 = auto) */
  gearboxAssist: number;
  /** Pit assist (0 = off, 1 = on) */
  pitAssist: number;
  /** Pit release assist (0 = off, 1 = on) */
  pitReleaseAssist: number;
  /** ERS assist (0 = off, 1 = on) */
  ersAssist: number;
  /** DRS assist (0 = off, 1 = on) */
  drsAssist: number;
  /** Dynamic racing line (0 = off, 1 = corners only, 2 = full) */
  dynamicRacingLine: number;
  /** Dynamic racing line type (0 = 2D, 1 = 3D) */
  dynamicRacingLineType: number;
  /** Game mode (0 = event mode, 3 = grand prix, 4 = grand prix 2018, etc) */
  gameMode: number;
  /** Ruleset (0 = practice & qualifying, 1 = race, 2 = time trial, etc) */
  ruleSet: number;
  /** Time of day (minutes since midnight) */
  timeOfDay: number;
  /** Session length (0 = none, 2 = very short, 3 = short, 4 = medium, etc) */
  sessionLength: number;
  /** Speed units (0 = mph, 1 = kph) */
  speedUnitsLeadPlayer: number;
  speedUnitsSecondaryPlayer: number;
  /** Temperature units (0 = celsius, 1 = fahrenheit) */
  temperatureUnitsLeadPlayer: number;
  temperatureUnitsSecondaryPlayer: number;
  /** Player ID - Steam id for player on Steam */
  numSafetyCarPeriods: number;
  numVirtualSafetyCarPeriods: number;
  numRedFlagPeriods: number;
}

/** Session type identifiers */
export enum SessionType {
  Unknown = 0,
  P1 = 1,
  P2 = 2,
  P3 = 3,
  ShortP = 4,
  Q1 = 5,
  Q2 = 6,
  Q3 = 7,
  ShortQ = 8,
  OneShotQ = 9,
  Race = 10,
  Race2 = 11,
  Race3 = 12,
  TimeTrial = 13,
}

/** Weather identifiers */
export enum Weather {
  Clear = 0,
  LightCloud = 1,
  Overcast = 2,
  LightRain = 3,
  HeavyRain = 4,
  Storm = 5,
}

/** Track IDs (subset - common tracks) */
export enum Track {
  Unknown = -1,
  Silverstone = 0,
  Monza = 1,
  Shanghai = 2,
  Bahrain = 3,
  Catalunya = 4,
  Monaco = 5,
  Montreal = 6,
  MagnyCours = 7,
  Silverstone2008 = 8,
  Singapore = 9,
  Spa = 10,
  Fuji = 11,
  // ... many more tracks
  Miami = 82,
  LasVegas = 83,
  Losail = 84,
  Imola = 85,
  Portimao = 86,
  Jeddah = 87,
}
