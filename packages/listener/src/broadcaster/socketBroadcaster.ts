import { Server as SocketIOServer } from 'socket.io';
import type { Logger } from 'pino';
import { PacketEmitter } from '../emitter/packetEmitter.js';
import { PacketHeader, CarTelemetryPacket, LapDataPacket, SessionPacket, CarStatusPacket, MotionPacket } from '@f1t/types/packets';

export interface SocketBroadcasterOptions {
  /** Port for Socket.io server (default: 3002) */
  port?: number;
  /** CORS origin (default: *) */
  corsOrigin?: string;
}

/**
 * Socket.io broadcaster for real-time telemetry
 * Relays parsed packets to connected dashboard clients
 */
export class SocketBroadcaster {
  private io: SocketIOServer | null = null;
  private logger: Logger;
  private emitter: PacketEmitter;
  private port: number;
  private corsOrigin: string;
  private connectedClients = 0;

  constructor(emitter: PacketEmitter, logger: Logger, options: SocketBroadcasterOptions = {}) {
    this.emitter = emitter;
    this.logger = logger.child({ component: 'SocketBroadcaster' });
    this.port = options.port ?? parseInt(process.env.WS_PORT ?? '3002', 10);
    this.corsOrigin = options.corsOrigin ?? '*';
  }

  /**
   * Start the Socket.io server
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.io = new SocketIOServer({
        cors: {
          origin: this.corsOrigin,
          methods: ['GET', 'POST'],
        },
      });

      this.io.on('connection', (socket) => {
        this.connectedClients++;
        this.logger.info(
          { clientId: socket.id, totalClients: this.connectedClients },
          'Client connected'
        );

        socket.on('disconnect', () => {
          this.connectedClients--;
          this.logger.info(
            { clientId: socket.id, totalClients: this.connectedClients },
            'Client disconnected'
          );
        });
      });

      this.io.listen(this.port);
      this.logger.info({ port: this.port }, 'Socket.io server started');

      this.setupPacketForwarding();
      resolve();
    });
  }

  /**
   * Stop the Socket.io server
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.io) {
        resolve();
        return;
      }

      this.io.close(() => {
        this.logger.info('Socket.io server stopped');
        this.io = null;
        resolve();
      });
    });
  }

  /**
   * Get number of connected clients
   */
  getConnectedClientCount(): number {
    return this.connectedClients;
  }

  private setupPacketForwarding(): void {
    // Forward car telemetry packets
    this.emitter.on('carTelemetry', (header: PacketHeader, data: CarTelemetryPacket) => {
      this.broadcast('carTelemetry', { header, data });
    });

    // Forward lap data packets
    this.emitter.on('lapData', (header: PacketHeader, data: LapDataPacket) => {
      this.broadcast('lapData', { header, data });
    });

    // Forward session packets
    this.emitter.on('session', (header: PacketHeader, data: SessionPacket) => {
      this.broadcast('session', { header, data });
    });

    // Forward car status packets
    this.emitter.on('carStatus', (header: PacketHeader, data: CarStatusPacket) => {
      this.broadcast('carStatus', { header, data });
    });

    // Forward motion packets
    this.emitter.on('motion', (header: PacketHeader, data: MotionPacket) => {
      this.broadcast('motion', { header, data });
    });
  }

  private broadcast(event: string, data: unknown): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }
}

export default SocketBroadcaster;
