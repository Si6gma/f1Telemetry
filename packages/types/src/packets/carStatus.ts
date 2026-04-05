/**
 * Car Status Packet (ID: 7)
 * Contains car status data for all 22 cars
 */

export interface CarStatusData {
  /** Traction control (0 = off, 1 = medium, 2 = full) */
  tractionControl: number;
  /** Anti-lock braking (0 = off, 1 = on) */
  antiLockBrakes: number;
  /** Fuel mix (0 = lean, 1 = standard, 2 = rich, 3 = max) */
  fuelMix: number;
  /** Front brake bias (percentage) */
  frontBrakeBias: number;
  /** Pit limiter status (0 = off, 1 = on) */
  pitLimiterStatus: number;
  /** Current fuel mass */
  fuelInTank: number;
  /** Maximum fuel capacity */
  fuelCapacity: number;
  /** In the case of formation lap violations, the number of penalties a driver has pending (pits to serve) */
  fuelRemainingLaps: number;
  /** Maximum RPM */
  maxRPM: number;
  /** Idle RPM */
  idleRPM: number;
  /** Maximum number of gears */
  maxGears: number;
  /** DRS allowed (0 = not allowed, 1 = allowed, -1 = unknown) */
  drsAllowed: number;
  /** DRS activation distance (0 = not valid, otherwise distance in metres) */
  drsActivationDistance: number;
  /** Actual tyre compound (16 = C5, 17 = C4, 18 = C3, 19 = C2, 20 = C1, etc) */
  actualTyreCompound: number;
  /** Visual tyre compound (16 = soft, 17 = medium, 18 = hard, etc) */
  visualTyreCompound: number;
  /** Age in laps of the current set of tyres */
  tyresAgeLaps: number;
  /** Vehicle FIA flags (-1 = invalid/unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow, 4 = red) */
  vehicleFiaFlags: number;
  /** Engine power ICE (Watts) */
  enginePowerICE: number;
  /** Engine power MGUK (Watts) */
  enginePowerMGUK: number;
  /** ERS energy store in Joules */
  ersStoreEnergy: number;
  /** ERS deployment mode (0 = none, 1 = medium, 2 = hotlap, 3 = overtake, etc) */
  ersDeployMode: number;
  /** ERS harvested this lap from MGUK */
  ersHarvestedThisLapMGUK: number;
  /** ERS harvested this lap from MGUH */
  ersHarvestedThisLapMGUH: number;
  /** ERS deployed this lap */
  ersDeployedThisLap: number;
  /** Whether the car is penalised with a stop/go penalty */
  networkPaused: number;
}

export interface CarStatusPacket {
  /** Status data for all cars */
  carStatusData: CarStatusData[];
}

/** Tyre compound identifiers */
export enum TyreCompound {
  C5 = 16,
  C4 = 17,
  C3 = 18,
  C2 = 19,
  C1 = 20,
  Inter = 7,
  Wet = 8,
  ClassicDry = 9,
  ClassicWet = 10,
  F2SuperSoft = 11,
  F2Soft = 12,
  F2Medium = 13,
  F2Hard = 14,
  F2Wet = 15,
}

/** ERS deploy mode identifiers */
export enum ERSDeployMode {
  None = 0,
  Medium = 1,
  Hotlap = 2,
  Overtake = 3,
}
