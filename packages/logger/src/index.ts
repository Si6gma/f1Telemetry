import { PacketEmitter, createLogger as createListenerLogger } from '@f1t/listener';
import type { Logger } from 'pino';
import { initDatabase, migrate, closeDatabase } from './db/client.js';
import { SessionWriter } from './writers/sessionWriter.js';
import { LapWriter } from './writers/lapWriter.js';
import { TelemetryWriter } from './writers/telemetryWriter.js';
import { LapDetector } from './detection/lapDetector.js';
import { createLogger } from './utils/logger.js';

export interface LoggerConfig {
  /** Database file path */
  dbPath?: string;
}

/**
 * TelemetryLogger combines all writers and manages the database
 */
export class TelemetryLogger {
  private logger: Logger;
  private emitter: PacketEmitter;
  private sessionWriter: SessionWriter;
  private lapWriter: LapWriter;
  private telemetryWriter: TelemetryWriter;
  private lapDetector: LapDetector;

  // Cached packet data
  private lastCarStatus: import('@f1t/types/packets').CarStatusPacket | null = null;
  private lastLapData: import('@f1t/types/packets').LapDataPacket | null = null;

  constructor(emitter: PacketEmitter, config: LoggerConfig = {}) {
    this.logger = createLogger('logger');
    this.emitter = emitter;

    // Initialize database
    initDatabase({ path: config.dbPath });
    migrate();

    // Initialize writers
    this.sessionWriter = new SessionWriter(this.logger);
    this.lapWriter = new LapWriter(this.logger);
    this.telemetryWriter = new TelemetryWriter(this.logger);
    this.lapDetector = new LapDetector(this.lapWriter, this.logger);

    this.setupEventHandlers();
  }

  /**
   * Start the logger
   */
  start(): void {
    this.logger.info('Telemetry logger started');
  }

  /**
   * Stop the logger and close database
   */
  stop(): void {
    this.logger.info('Stopping telemetry logger...');
    
    // Finalize current lap
    this.lapDetector.finalizeCurrentLap();
    
    // Flush telemetry
    this.telemetryWriter.flush();
    
    // End current session
    this.sessionWriter.endCurrentSession();
    
    // Close database
    closeDatabase();
    
    this.logger.info('Telemetry logger stopped');
  }

  private setupEventHandlers(): void {
    // Handle session packets
    this.emitter.on('session', (header, packet) => {
      const prevSessionId = this.sessionWriter.getCurrentSessionId();
      this.sessionWriter.handleSession(header, packet);
      const newSessionId = this.sessionWriter.getCurrentSessionId();

      // Reset state on new session
      if (newSessionId !== prevSessionId) {
        this.lapWriter.reset();
        this.telemetryWriter.reset();
        this.lapDetector.setSessionId(newSessionId);
        this.lapDetector.reset();
      }
    });

    // Handle car status packets
    this.emitter.on('carStatus', (_header, packet) => {
      this.lastCarStatus = packet;
    });

    // Handle lap data packets
    this.emitter.on('lapData', (header, packet) => {
      this.lastLapData = packet;
      
      const sessionId = this.sessionWriter.getCurrentSessionId();
      if (sessionId) {
        this.lapWriter.handleLapData(
          sessionId,
          header,
          packet,
          this.lastCarStatus?.carStatusData[header.playerCarIndex] ?? null
        );
        this.lapDetector.handleLapData(header, packet.lapData);
      }
    });

    // Handle car telemetry packets
    this.emitter.on('carTelemetry', (header, packet) => {
      if (this.lastLapData) {
        this.telemetryWriter.handleCarTelemetry(
          header,
          packet.carTelemetryData,
          this.lastLapData.lapData
        );
      }
    });
  }
}

export { initDatabase, migrate, closeDatabase } from './db/client.js';
export { createLogger } from './utils/logger.js';
export type { LoggerConfig };
