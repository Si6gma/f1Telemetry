import { CarStatusPacket, CarStatusData } from '@f1t/types/packets';
import { readUInt8, readInt8, readUInt16LE, readFloatLE } from '../../utils/binary.js';

/** Number of cars in F1 23 */
const NUM_CARS = 22;

/** Size of each car status data in bytes */
const CAR_STATUS_SIZE = 51;

/**
 * Parse car status data for a single car
 */
function parseCarStatusData(buffer: Buffer, offset: number): CarStatusData {
  return {
    tractionControl: readUInt8(buffer, offset),
    antiLockBrakes: readUInt8(buffer, offset + 1),
    fuelMix: readUInt8(buffer, offset + 2),
    frontBrakeBias: readUInt8(buffer, offset + 3),
    pitLimiterStatus: readUInt8(buffer, offset + 4),
    fuelInTank: readFloatLE(buffer, offset + 5),
    fuelCapacity: readFloatLE(buffer, offset + 9),
    fuelRemainingLaps: readFloatLE(buffer, offset + 13),
    maxRPM: readUInt16LE(buffer, offset + 17),
    idleRPM: readUInt16LE(buffer, offset + 19),
    maxGears: readUInt8(buffer, offset + 21),
    drsAllowed: readInt8(buffer, offset + 22),
    drsActivationDistance: readUInt16LE(buffer, offset + 23),
    actualTyreCompound: readUInt8(buffer, offset + 25),
    visualTyreCompound: readUInt8(buffer, offset + 26),
    tyresAgeLaps: readUInt8(buffer, offset + 27),
    vehicleFiaFlags: readInt8(buffer, offset + 28),
    enginePowerICE: readFloatLE(buffer, offset + 29),
    enginePowerMGUK: readFloatLE(buffer, offset + 33),
    ersStoreEnergy: readFloatLE(buffer, offset + 37),
    ersDeployMode: readUInt8(buffer, offset + 41),
    ersHarvestedThisLapMGUK: readFloatLE(buffer, offset + 42),
    ersHarvestedThisLapMGUH: readFloatLE(buffer, offset + 46),
    ersDeployedThisLap: readFloatLE(buffer, offset + 50),
    networkPaused: readUInt8(buffer, offset + 54),
  };
}

/**
 * Parse the car status packet
 * @param buffer - Buffer starting after the header
 * @returns Parsed car status packet
 */
export function parseCarStatusPacket(buffer: Buffer): CarStatusPacket {
  const carStatusData: CarStatusData[] = [];

  for (let i = 0; i < NUM_CARS; i++) {
    carStatusData.push(parseCarStatusData(buffer, i * CAR_STATUS_SIZE));
  }

  return {
    carStatusData,
  };
}
