import { PacketId, PacketHeader } from '@f1t/types/packets';
import { parseHeader, HEADER_SIZE, isValidF123Packet, getPacketId } from './header.js';
import { parseCarTelemetryPacket } from './packets/carTelemetry.js';
import { parseLapDataPacket } from './packets/lapData.js';
import { parseSessionPacket } from './packets/session.js';
import { parseCarStatusPacket } from './packets/carStatus.js';
import { parseMotionPacket } from './packets/motion.js';

export { parseHeader, HEADER_SIZE, isValidF123Packet, getPacketId };
export * from './packets/carTelemetry.js';
export * from './packets/lapData.js';
export * from './packets/session.js';
export * from './packets/carStatus.js';
export * from './packets/motion.js';

/**
 * Union type for all parsed packets
 */
export type ParsedPacket =
  | { type: PacketId.CarTelemetry; header: PacketHeader; data: ReturnType<typeof parseCarTelemetryPacket> }
  | { type: PacketId.LapData; header: PacketHeader; data: ReturnType<typeof parseLapDataPacket> }
  | { type: PacketId.Session; header: PacketHeader; data: ReturnType<typeof parseSessionPacket> }
  | { type: PacketId.CarStatus; header: PacketHeader; data: ReturnType<typeof parseCarStatusPacket> }
  | { type: PacketId.Motion; header: PacketHeader; data: ReturnType<typeof parseMotionPacket> }
  | { type: 'unknown'; header: PacketHeader; data: null };

/**
 * Parse a raw UDP packet buffer into a structured packet
 * @param buffer - Raw packet buffer
 * @returns Parsed packet or null if invalid
 */
export function parsePacket(buffer: Buffer): ParsedPacket | null {
  if (!isValidF123Packet(buffer)) {
    return null;
  }

  const header = parseHeader(buffer);
  const packetId = getPacketId(buffer);
  const dataBuffer = buffer.subarray(HEADER_SIZE);

  switch (packetId) {
    case PacketId.CarTelemetry:
      return {
        type: PacketId.CarTelemetry,
        header,
        data: parseCarTelemetryPacket(dataBuffer),
      };

    case PacketId.LapData:
      return {
        type: PacketId.LapData,
        header,
        data: parseLapDataPacket(dataBuffer),
      };

    case PacketId.Session:
      return {
        type: PacketId.Session,
        header,
        data: parseSessionPacket(dataBuffer),
      };

    case PacketId.CarStatus:
      return {
        type: PacketId.CarStatus,
        header,
        data: parseCarStatusPacket(dataBuffer),
      };

    case PacketId.Motion:
      return {
        type: PacketId.Motion,
        header,
        data: parseMotionPacket(dataBuffer),
      };

    default:
      return {
        type: 'unknown',
        header,
        data: null,
      };
  }
}

export { PacketId };
