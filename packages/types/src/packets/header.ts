/**
 * F1 23 Packet Header
 * All packets begin with this 24-byte header (except Final Classification and Lobby Info in some versions)
 * @see https://answers.ea.com/t5/General-Discussion/F1-23-UDP-Specification/td-p/12631358
 */
export interface PacketHeader {
  /** Packet format (2023 for F1 23) */
  packetFormat: number;
  /** Game year (23) */
  gameYear: number;
  /** Game version major */
  gameMajorVersion: number;
  /** Game version minor */
  gameMinorVersion: number;
  /** Version packet type-specific */
  packetVersion: number;
  /** Unique identifier for the session */
  sessionUID: bigint;
  /** Session timestamp (milliseconds since session start) */
  sessionTime: number;
  /** Unique identifier for the frame */
  frameIdentifier: number;
  /** Overall identifier for the frame */
  overallFrameIdentifier: number;
  /** Index of the player's car */
  playerCarIndex: number;
  /** Index of secondary player's car (splitscreen) */
  secondaryPlayerCarIndex: number;
}

/** Packet type identifiers */
export enum PacketId {
  Motion = 0,
  Session = 1,
  LapData = 2,
  Event = 3,
  Participants = 4,
  CarSetups = 5,
  CarTelemetry = 6,
  CarStatus = 7,
  FinalClassification = 8,
  LobbyInfo = 9,
  CarDamage = 10,
  SessionHistory = 11,
  TyreSets = 12,
  MotionEx = 13,
}
