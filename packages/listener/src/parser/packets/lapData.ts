import { LapDataPacket, LapData } from '@f1t/types/packets';
import {
  readUInt32LE,
  readUInt16LE,
  readUInt8,
  readFloatLE,
  readInt8,
} from '../../utils/binary.js';

/** Number of cars in F1 23 */
const NUM_CARS = 22;

/** Size of each lap data in bytes */
const LAP_DATA_SIZE = 53;

/**
 * Parse lap data for a single car
 */
function parseLapData(buffer: Buffer, offset: number): LapData {
  return {
    lastLapTimeInMS: readUInt32LE(buffer, offset),
    currentLapTimeInMS: readUInt32LE(buffer, offset + 4),
    sector1TimeInMS: readUInt16LE(buffer, offset + 8),
    sector1TimeMinutes: readUInt8(buffer, offset + 10),
    sector2TimeInMS: readUInt16LE(buffer, offset + 11),
    sector2TimeMinutes: readUInt8(buffer, offset + 13),
    deltaToCarInFrontInMS: readUInt16LE(buffer, offset + 14),
    deltaToRaceLeaderInMS: readUInt16LE(buffer, offset + 16),
    lapDistance: readFloatLE(buffer, offset + 18),
    totalDistance: readFloatLE(buffer, offset + 22),
    safetyCarDelta: readInt8(buffer, offset + 26),
    carPosition: readUInt8(buffer, offset + 27),
    currentLapNum: readUInt8(buffer, offset + 28),
    pitStatus: readUInt8(buffer, offset + 29),
    numPitStops: readUInt8(buffer, offset + 30),
    sector: readUInt8(buffer, offset + 31),
    currentLapInvalid: readUInt8(buffer, offset + 32),
    penalties: readUInt8(buffer, offset + 33),
    totalWarnings: readUInt8(buffer, offset + 34),
    cornerCuttingWarnings: readUInt8(buffer, offset + 35),
    numUnservedDriveThroughPens: readUInt8(buffer, offset + 36),
    numUnservedStopGoPens: readUInt8(buffer, offset + 37),
    gridPosition: readUInt8(buffer, offset + 38),
    driverStatus: readUInt8(buffer, offset + 39),
    resultStatus: readUInt8(buffer, offset + 40),
    pitLaneTimerActive: readUInt8(buffer, offset + 41),
    pitLaneTimeInLaneInMS: readUInt16LE(buffer, offset + 42),
    pitStopTimerInMS: readUInt16LE(buffer, offset + 44),
    pitStopShouldServePen: readUInt8(buffer, offset + 46),
  };
}

/**
 * Parse the lap data packet
 * @param buffer - Buffer starting after the header
 * @returns Parsed lap data packet
 */
export function parseLapDataPacket(buffer: Buffer): LapDataPacket {
  const lapData: LapData[] = [];

  for (let i = 0; i < NUM_CARS; i++) {
    lapData.push(parseLapData(buffer, i * LAP_DATA_SIZE));
  }

  const offset = NUM_CARS * LAP_DATA_SIZE;

  return {
    lapData,
    timeTrialPBCarIdx: readUInt8(buffer, offset),
    timeTrialRivalCarIdx: readUInt8(buffer, offset + 1),
  };
}
