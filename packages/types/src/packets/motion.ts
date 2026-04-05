/**
 * Motion Packet (ID: 0)
 * Contains motion data for all 22 cars
 * Used for track map visualization
 */

export interface CarMotionData {
  /** World space X position */
  worldPositionX: number;
  /** World space Y position */
  worldPositionY: number;
  /** World space Z position */
  worldPositionZ: number;
  /** World space X velocity */
  worldVelocityX: number;
  /** World space Y velocity */
  worldVelocityY: number;
  /** World space Z velocity */
  worldVelocityZ: number;
  /** World space forward X direction (normalized) */
  worldForwardDirX: number;
  /** World space forward Y direction (normalized) */
  worldForwardDirY: number;
  /** World space forward Z direction (normalized) */
  worldForwardDirZ: number;
  /** World space right X direction (normalized) */
  worldRightDirX: number;
  /** World space right Y direction (normalized) */
  worldRightDirY: number;
  /** World space right Z direction (normalized) */
  worldRightDirZ: number;
  /** Lateral G-force component */
  gForceLateral: number;
  /** Longitudinal G-force component */
  gForceLongitudinal: number;
  /** Vertical G-force component */
  gForceVertical: number;
  /** Yaw angle in radians */
  yaw: number;
  /** Pitch angle in radians */
  pitch: number;
  /** Roll angle in radians */
  roll: number;
}

export interface MotionPacket {
  /** Motion data for all cars */
  carMotionData: CarMotionData[];
  /** Suspension position for each wheel (RL, RR, FL, FR) */
  suspensionPosition: [number, number, number, number];
  /** Suspension velocity for each wheel (RL, RR, FL, FR) */
  suspensionVelocity: [number, number, number, number];
  /** Suspension acceleration for each wheel (RL, RR, FL, FR) */
  suspensionAcceleration: [number, number, number, number];
  /** Wheel speed for each wheel (RL, RR, FL, FR) */
  wheelSpeed: [number, number, number, number];
  /** Slip ratio for each wheel (RL, RR, FL, FR) as percentage */
  wheelSlipRatio: [number, number, number, number];
  /** Slip angle for each wheel (RL, RR, FL, FR) */
  wheelSlipAngle: [number, number, number, number];
  /** Lateral slip for each wheel (RL, RR, FL, FR) */
  wheelLateralForce: [number, number, number, number];
  /** Longitudinal slip for each wheel (RL, RR, FL, FR) */
  wheelLongitudinalForce: [number, number, number, number];
  /** Height of centre of gravity above ground */
  heightOfCentreOfGravity: number;
  /** Local velocity X (in car coordinate space) */
  localVelocityX: number;
  /** Local velocity Y (in car coordinate space) */
  localVelocityY: number;
  /** Local velocity Z (in car coordinate space) */
  localVelocityZ: number;
  /** Angular velocity X (radians/s) */
  angularVelocityX: number;
  /** Angular velocity Y (radians/s) */
  angularVelocityY: number;
  /** Angular velocity Z (radians/s) */
  angularVelocityZ: number;
  /** Angular acceleration X (radians/s/s) */
  angularAccelerationX: number;
  /** Angular acceleration Y (radians/s/s) */
  angularAccelerationY: number;
  /** Angular acceleration Z (radians/s/s) */
  angularAccelerationZ: number;
  /** Current front wheel angle in radians */
  frontWheelsAngle: number;
}
