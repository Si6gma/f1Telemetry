import { MotionPacket, CarMotionData } from '@f1t/types/packets';
import { readFloatLE, readInt16LE } from '../../utils/binary.js';

/** Number of cars in F1 23 */
const NUM_CARS = 22;

/** Size of each car motion data in bytes */
const CAR_MOTION_SIZE = 60;

/**
 * Parse motion data for a single car
 */
function parseCarMotionData(buffer: Buffer, offset: number): CarMotionData {
  return {
    worldPositionX: readFloatLE(buffer, offset),
    worldPositionY: readFloatLE(buffer, offset + 4),
    worldPositionZ: readFloatLE(buffer, offset + 8),
    worldVelocityX: readFloatLE(buffer, offset + 12),
    worldVelocityY: readFloatLE(buffer, offset + 16),
    worldVelocityZ: readFloatLE(buffer, offset + 20),
    worldForwardDirX: readInt16LE(buffer, offset + 24) / 32767.0,
    worldForwardDirY: readInt16LE(buffer, offset + 26) / 32767.0,
    worldForwardDirZ: readInt16LE(buffer, offset + 28) / 32767.0,
    worldRightDirX: readInt16LE(buffer, offset + 30) / 32767.0,
    worldRightDirY: readInt16LE(buffer, offset + 32) / 32767.0,
    worldRightDirZ: readInt16LE(buffer, offset + 34) / 32767.0,
    gForceLateral: readFloatLE(buffer, offset + 36),
    gForceLongitudinal: readFloatLE(buffer, offset + 40),
    gForceVertical: readFloatLE(buffer, offset + 44),
    yaw: readFloatLE(buffer, offset + 48),
    pitch: readFloatLE(buffer, offset + 52),
    roll: readFloatLE(buffer, offset + 56),
  };
}

/**
 * Read 4 wheel values as a tuple
 */
function readWheelData(buffer: Buffer, offset: number): [number, number, number, number] {
  return [
    readFloatLE(buffer, offset),
    readFloatLE(buffer, offset + 4),
    readFloatLE(buffer, offset + 8),
    readFloatLE(buffer, offset + 12),
  ];
}

/**
 * Parse the motion packet
 * @param buffer - Buffer starting after the header
 * @returns Parsed motion packet
 */
export function parseMotionPacket(buffer: Buffer): MotionPacket {
  const carMotionData: CarMotionData[] = [];

  for (let i = 0; i < NUM_CARS; i++) {
    carMotionData.push(parseCarMotionData(buffer, i * CAR_MOTION_SIZE));
  }

  let offset = NUM_CARS * CAR_MOTION_SIZE;

  return {
    carMotionData,
    suspensionPosition: readWheelData(buffer, offset),
    suspensionVelocity: readWheelData(buffer, offset + 16),
    suspensionAcceleration: readWheelData(buffer, offset + 32),
    wheelSpeed: readWheelData(buffer, offset + 48),
    wheelSlipRatio: readWheelData(buffer, offset + 64),
    wheelSlipAngle: readWheelData(buffer, offset + 80),
    wheelLateralForce: readWheelData(buffer, offset + 96),
    wheelLongitudinalForce: readWheelData(buffer, offset + 112),
    heightOfCentreOfGravity: readFloatLE(buffer, offset + 128),
    localVelocityX: readFloatLE(buffer, offset + 132),
    localVelocityY: readFloatLE(buffer, offset + 136),
    localVelocityZ: readFloatLE(buffer, offset + 140),
    angularVelocityX: readFloatLE(buffer, offset + 144),
    angularVelocityY: readFloatLE(buffer, offset + 148),
    angularVelocityZ: readFloatLE(buffer, offset + 152),
    angularAccelerationX: readFloatLE(buffer, offset + 156),
    angularAccelerationY: readFloatLE(buffer, offset + 160),
    angularAccelerationZ: readFloatLE(buffer, offset + 164),
    frontWheelsAngle: readFloatLE(buffer, offset + 168),
  };
}
