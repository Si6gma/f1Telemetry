import { SessionPacket, MarshalZone, WeatherForecastSample } from '@f1t/types/packets';
import { readUInt8, readInt8, readUInt16LE, readFloatLE, readUInt32LE } from '../../utils/binary.js';

/** Maximum number of marshal zones */
const MAX_MARSHAL_ZONES = 21;

/** Maximum number of weather forecast samples */
const MAX_WEATHER_SAMPLES = 64;

/**
 * Parse a single marshal zone
 */
function parseMarshalZone(buffer: Buffer, offset: number): MarshalZone {
  return {
    zoneStart: readFloatLE(buffer, offset),
    zoneFlag: readInt8(buffer, offset + 4),
  };
}

/**
 * Parse a single weather forecast sample
 */
function parseWeatherForecastSample(buffer: Buffer, offset: number): WeatherForecastSample {
  return {
    sessionType: readUInt8(buffer, offset),
    timeOffset: readUInt8(buffer, offset + 1),
    weather: readUInt8(buffer, offset + 2),
    trackTemperature: readInt8(buffer, offset + 3),
    trackTemperatureChange: readUInt8(buffer, offset + 4),
    airTemperature: readInt8(buffer, offset + 5),
    airTemperatureChange: readUInt8(buffer, offset + 6),
    rainPercentage: readUInt8(buffer, offset + 7),
  };
}

/**
 * Parse the session packet
 * @param buffer - Buffer starting after the header
 * @returns Parsed session packet
 */
export function parseSessionPacket(buffer: Buffer): SessionPacket {
  let offset = 0;

  const weather = readUInt8(buffer, offset);
  offset += 1;

  const trackTemperature = readInt8(buffer, offset);
  offset += 1;

  const airTemperature = readInt8(buffer, offset);
  offset += 1;

  const totalLaps = readUInt8(buffer, offset);
  offset += 1;

  const trackLength = readUInt16LE(buffer, offset);
  offset += 2;

  const sessionType = readUInt8(buffer, offset);
  offset += 1;

  const trackId = readInt8(buffer, offset);
  offset += 1;

  const formula = readUInt8(buffer, offset);
  offset += 1;

  const sessionTimeLeft = readUInt16LE(buffer, offset);
  offset += 2;

  const sessionDuration = readUInt16LE(buffer, offset);
  offset += 2;

  const pitSpeedLimit = readUInt8(buffer, offset);
  offset += 1;

  const gamePaused = readUInt8(buffer, offset);
  offset += 1;

  const isSpectating = readUInt8(buffer, offset);
  offset += 1;

  const spectatorCarIndex = readUInt8(buffer, offset);
  offset += 1;

  const sliProNativeSupport = readUInt8(buffer, offset);
  offset += 1;

  const numMarshalZones = readUInt8(buffer, offset);
  offset += 1;

  // Parse marshal zones
  const marshalZones: MarshalZone[] = [];
  for (let i = 0; i < MAX_MARSHAL_ZONES; i++) {
    marshalZones.push(parseMarshalZone(buffer, offset + i * 5));
  }
  offset += MAX_MARSHAL_ZONES * 5;

  const safetyCarStatus = readUInt8(buffer, offset);
  offset += 1;

  const networkGame = readUInt8(buffer, offset);
  offset += 1;

  const numWeatherForecastSamples = readUInt8(buffer, offset);
  offset += 1;

  // Parse weather forecast samples
  const weatherForecastSamples: WeatherForecastSample[] = [];
  for (let i = 0; i < MAX_WEATHER_SAMPLES; i++) {
    weatherForecastSamples.push(parseWeatherForecastSample(buffer, offset + i * 8));
  }
  offset += MAX_WEATHER_SAMPLES * 8;

  return {
    weather,
    trackTemperature,
    airTemperature,
    totalLaps,
    trackLength,
    sessionType,
    trackId,
    formula,
    sessionTimeLeft,
    sessionDuration,
    pitSpeedLimit,
    gamePaused,
    isSpectating,
    spectatorCarIndex,
    sliProNativeSupport,
    numMarshalZones,
    marshalZones,
    safetyCarStatus,
    networkGame,
    numWeatherForecastSamples,
    weatherForecastSamples,
    forecastAccuracy: readUInt8(buffer, offset),
    aiDifficulty: readUInt8(buffer, offset + 1),
    seasonLinkIdentifier: readUInt32LE(buffer, offset + 2),
    weekendLinkIdentifier: readUInt32LE(buffer, offset + 6),
    sessionLinkIdentifier: readUInt32LE(buffer, offset + 10),
    pitStopWindowIdealLap: readUInt8(buffer, offset + 14),
    pitStopWindowLatestLap: readUInt8(buffer, offset + 15),
    pitStopRejoinPosition: readUInt8(buffer, offset + 16),
    steeringAssist: readUInt8(buffer, offset + 17),
    brakingAssist: readUInt8(buffer, offset + 18),
    gearboxAssist: readUInt8(buffer, offset + 19),
    pitAssist: readUInt8(buffer, offset + 20),
    pitReleaseAssist: readUInt8(buffer, offset + 21),
    ersAssist: readUInt8(buffer, offset + 22),
    drsAssist: readUInt8(buffer, offset + 23),
    dynamicRacingLine: readUInt8(buffer, offset + 24),
    dynamicRacingLineType: readUInt8(buffer, offset + 25),
    gameMode: readUInt8(buffer, offset + 26),
    ruleSet: readUInt8(buffer, offset + 27),
    timeOfDay: readUInt32LE(buffer, offset + 28),
    sessionLength: readUInt8(buffer, offset + 32),
    speedUnitsLeadPlayer: readUInt8(buffer, offset + 33),
    speedUnitsSecondaryPlayer: readUInt8(buffer, offset + 34),
    temperatureUnitsLeadPlayer: readUInt8(buffer, offset + 35),
    temperatureUnitsSecondaryPlayer: readUInt8(buffer, offset + 36),
    numSafetyCarPeriods: readUInt8(buffer, offset + 37),
    numVirtualSafetyCarPeriods: readUInt8(buffer, offset + 38),
    numRedFlagPeriods: readUInt8(buffer, offset + 39),
  };
}
