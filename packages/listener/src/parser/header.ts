import { PacketHeader, PacketId } from '@f1t/types/packets';
import { readUInt16LE, readUInt8, readUInt64LE, readFloatLE, readUInt32LE } from '../utils/binary.js';

/** Header size in bytes */
export const HEADER_SIZE = 28;

/**
 * Parse the packet header from a buffer
 * @param buffer - Raw packet buffer
 * @returns Parsed header and remaining buffer offset
 */
export function parseHeader(buffer: Buffer): PacketHeader {
  return {
    packetFormat: readUInt16LE(buffer, 0),
    gameYear: readUInt8(buffer, 2),
    gameMajorVersion: readUInt8(buffer, 3),
    gameMinorVersion: readUInt8(buffer, 4),
    packetVersion: readUInt8(buffer, 5),
    sessionUID: readUInt64LE(buffer, 6),
    sessionTime: readFloatLE(buffer, 14),
    frameIdentifier: readUInt32LE(buffer, 18),
    overallFrameIdentifier: readUInt32LE(buffer, 22),
    playerCarIndex: readUInt8(buffer, 26),
    secondaryPlayerCarIndex: readUInt8(buffer, 27),
  };
}

/**
 * Get the packet ID from the header
 * @param buffer - Raw packet buffer
 * @returns PacketId enum value
 */
export function getPacketId(buffer: Buffer): PacketId {
  return readUInt8(buffer, 5) as PacketId;
}

/**
 * Validate that this is an F1 23 packet (format 2023)
 * @param buffer - Raw packet buffer
 * @returns True if valid F1 23 packet
 */
export function isValidF123Packet(buffer: Buffer): boolean {
  if (buffer.length < HEADER_SIZE) return false;
  const packetFormat = readUInt16LE(buffer, 0);
  return packetFormat === 2023;
}

export { PacketId } from '@f1t/types/packets';
