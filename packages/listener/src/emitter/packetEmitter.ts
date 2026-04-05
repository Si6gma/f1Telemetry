import EventEmitter from 'events';
import {
  PacketHeader,
  CarTelemetryPacket,
  LapDataPacket,
  SessionPacket,
  CarStatusPacket,
  MotionPacket,
} from '@f1t/types/packets';
import type { Logger } from 'pino';

/**
 * Events emitted by the PacketEmitter
 */
export interface PacketEvents {
  carTelemetry: (header: PacketHeader, data: CarTelemetryPacket) => void;
  lapData: (header: PacketHeader, data: LapDataPacket) => void;
  session: (header: PacketHeader, data: SessionPacket) => void;
  carStatus: (header: PacketHeader, data: CarStatusPacket) => void;
  motion: (header: PacketHeader, data: MotionPacket) => void;
  raw: (buffer: Buffer) => void;
  error: (error: Error) => void;
}

/**
 * Typed EventEmitter for F1 23 packets
 * Downstream consumers subscribe to specific packet types
 */
export class PacketEmitter extends EventEmitter {
  private logger: Logger;
  private packetCounts: Map<string, number> = new Map();
  private lastLogTime = Date.now();

  constructor(logger: Logger) {
    super();
    this.logger = logger.child({ component: 'PacketEmitter' });
  }

  /**
   * Emit a car telemetry packet
   */
  emitCarTelemetry(header: PacketHeader, data: CarTelemetryPacket): void {
    this.incrementCount('carTelemetry');
    this.emit('carTelemetry', header, data);
  }

  /**
   * Emit a lap data packet
   */
  emitLapData(header: PacketHeader, data: LapDataPacket): void {
    this.incrementCount('lapData');
    this.emit('lapData', header, data);
  }

  /**
   * Emit a session packet
   */
  emitSession(header: PacketHeader, data: SessionPacket): void {
    this.incrementCount('session');
    this.emit('session', header, data);
  }

  /**
   * Emit a car status packet
   */
  emitCarStatus(header: PacketHeader, data: CarStatusPacket): void {
    this.incrementCount('carStatus');
    this.emit('carStatus', header, data);
  }

  /**
   * Emit a motion packet
   */
  emitMotion(header: PacketHeader, data: MotionPacket): void {
    this.incrementCount('motion');
    this.emit('motion', header, data);
  }

  /**
   * Emit raw buffer for debugging
   */
  emitRaw(buffer: Buffer): void {
    this.emit('raw', buffer);
  }

  /**
   * Emit an error
   */
  emitError(error: Error): void {
    this.logger.error({ error: error.message }, 'Packet emitter error');
    this.emit('error', error);
  }

  /**
   * Get packet count statistics
   */
  getStats(): Record<string, number> {
    return Object.fromEntries(this.packetCounts);
  }

  /**
   * Log statistics every 10 seconds
   */
  maybeLogStats(): void {
    const now = Date.now();
    if (now - this.lastLogTime > 10000) {
      this.logger.debug(this.getStats(), 'Packet statistics');
      this.lastLogTime = now;
    }
  }

  private incrementCount(type: string): void {
    const current = this.packetCounts.get(type) ?? 0;
    this.packetCounts.set(type, current + 1);
    this.maybeLogStats();
  }
}

export default PacketEmitter;
