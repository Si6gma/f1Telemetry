import { CarTelemetryPacket, CarTelemetryData } from '@f1t/types/packets';
import { readUInt16LE, readUInt8, readFloatLE, readInt8 } from '../../utils/binary.js';

/** Number of cars in F1 23 */
const NUM_CARS = 22;

/** Size of each car telemetry data in bytes */
const CAR_TELEMETRY_SIZE = 58;

/**
 * Parse car telemetry data for a single car
 */
function parseCarTelemetryData(buffer: Buffer, offset: number): CarTelemetryData {
  return {
    speed: readUInt16LE(buffer, offset),
    throttle: readFloatLE(buffer, offset + 2),
    steer: readFloatLE(buffer, offset + 6),
    brake: readFloatLE(buffer, offset + 10),
    clutch: readUInt8(buffer, offset + 14),
    gear: readInt8(buffer, offset + 15),
    engineRPM: readUInt16LE(buffer, offset + 16),
    drs: readUInt8(buffer, offset + 18),
    revLightsPercent: readUInt8(buffer, offset + 19),
    revLightsBitValue: readUInt16LE(buffer, offset + 20),
    brakesTemperature: [
      readUInt16LE(buffer, offset + 22),
      readUInt16LE(buffer, offset + 24),
      readUInt16LE(buffer, offset + 26),
      readUInt16LE(buffer, offset + 28),
    ],
    tyresSurfaceTemperature: [
      readUInt8(buffer, offset + 30),
      readUInt8(buffer, offset + 31),
      readUInt8(buffer, offset + 32),
      readUInt8(buffer, offset + 33),
    ],
    tyresInnerTemperature: [
      readUInt8(buffer, offset + 34),
      readUInt8(buffer, offset + 35),
      readUInt8(buffer, offset + 36),
      readUInt8(buffer, offset + 37),
    ],
    engineTemperature: readUInt16LE(buffer, offset + 38),
    tyresPressure: [
      readFloatLE(buffer, offset + 40),
      readFloatLE(buffer, offset + 44),
      readFloatLE(buffer, offset + 48),
      readFloatLE(buffer, offset + 52),
    ],
    surfaceType: [
      readUInt8(buffer, offset + 56),
      readUInt8(buffer, offset + 57),
      readUInt8(buffer, offset + 58),
      readUInt8(buffer, offset + 59),
    ],
  };
}

/**
 * Parse the car telemetry packet
 * @param buffer - Buffer starting after the header
 * @returns Parsed car telemetry packet
 */
export function parseCarTelemetryPacket(buffer: Buffer): CarTelemetryPacket {
  const carTelemetryData: CarTelemetryData[] = [];

  for (let i = 0; i < NUM_CARS; i++) {
    carTelemetryData.push(parseCarTelemetryData(buffer, i * CAR_TELEMETRY_SIZE));
  }

  const offset = NUM_CARS * CAR_TELEMETRY_SIZE;

  return {
    carTelemetryData,
    mfdPanelIndex: readUInt8(buffer, offset),
    mfdPanelIndexSecondaryPlayer: readUInt8(buffer, offset + 1),
    suggestedGear: readInt8(buffer, offset + 2),
  };
}
