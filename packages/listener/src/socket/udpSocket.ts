import dgram from 'dgram';
import type { Logger } from 'pino';
import { PacketEmitter } from '../emitter/packetEmitter.js';
import { parsePacket, PacketId } from '../parser/index.js';

export interface UDPSocketOptions {
  /** Host to bind to (default: 0.0.0.0) */
  host?: string;
  /** Port to bind to (default: 20777) */
  port?: number;
}

/**
 * UDP socket handler for F1 23 telemetry
 * Binds to a port and parses incoming packets
 */
export class UDPSocket {
  private socket: dgram.Socket | null = null;
  private logger: Logger;
  private emitter: PacketEmitter;
  private host: string;
  private port: number;

  constructor(emitter: PacketEmitter, logger: Logger, options: UDPSocketOptions = {}) {
    this.emitter = emitter;
    this.logger = logger.child({ component: 'UDPSocket' });
    this.host = options.host ?? process.env.UDP_BIND_HOST ?? '0.0.0.0';
    this.port = options.port ?? parseInt(process.env.UDP_PORT ?? '20777', 10);
  }

  /**
   * Start listening for UDP packets
   */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = dgram.createSocket('udp4');

      this.socket.on('message', (msg) => {
        this.handleMessage(msg);
      });

      this.socket.on('error', (err) => {
        this.logger.error({ error: err.message }, 'UDP socket error');
        this.emitter.emitError(err);
        reject(err);
      });

      this.socket.on('listening', () => {
        const address = this.socket?.address();
        this.logger.info(
          { host: this.host, port: this.port, address },
          'UDP socket listening'
        );
        resolve();
      });

      this.socket.bind(this.port, this.host);
    });
  }

  /**
   * Stop listening and close the socket
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve();
        return;
      }

      this.socket.close(() => {
        this.logger.info('UDP socket closed');
        this.socket = null;
        resolve();
      });
    });
  }

  /**
   * Check if the socket is listening
   */
  isListening(): boolean {
    return this.socket !== null;
  }

  private handleMessage(msg: Buffer): void {
    // Emit raw for debugging
    this.emitter.emitRaw(msg);

    // Parse the packet
    const packet = parsePacket(msg);

    if (!packet) {
      this.logger.warn({ size: msg.length }, 'Invalid packet received');
      return;
    }

    // Emit typed packet
    switch (packet.type) {
      case PacketId.CarTelemetry:
        if (packet.data) {
          this.emitter.emitCarTelemetry(packet.header, packet.data);
        }
        break;
      case PacketId.LapData:
        if (packet.data) {
          this.emitter.emitLapData(packet.header, packet.data);
        }
        break;
      case PacketId.Session:
        if (packet.data) {
          this.emitter.emitSession(packet.header, packet.data);
        }
        break;
      case PacketId.CarStatus:
        if (packet.data) {
          this.emitter.emitCarStatus(packet.header, packet.data);
        }
        break;
      case PacketId.Motion:
        if (packet.data) {
          this.emitter.emitMotion(packet.header, packet.data);
        }
        break;
      default:
        // Unknown packet type - ignore
        break;
    }
  }
}

export default UDPSocket;
