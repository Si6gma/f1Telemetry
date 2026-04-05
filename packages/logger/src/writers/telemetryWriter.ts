import type { Logger } from 'pino';
import { telemetry, type NewTelemetry } from '../db/schema.js';
import { getDatabase } from '../db/client.js';
import type { CarTelemetryData, LapData, PacketHeader } from '@f1t/types/packets';

/**
 * Buffers telemetry points and writes them to the database
 */
export class TelemetryWriter {
  private logger: Logger;
  private buffer: NewTelemetry[] = [];
  private readonly BUFFER_SIZE = 50; // Write every 50 points
  private currentLapId: number | null = null;

  constructor(logger: Logger) {
    this.logger = logger.child({ component: 'TelemetryWriter' });
  }

  /**
   * Set the current lap ID that telemetry should be associated with
   */
  setCurrentLapId(lapId: number | null): void {
    // Flush any buffered data for the previous lap
    if (this.currentLapId !== lapId && this.buffer.length > 0) {
      this.flush();
    }
    this.currentLapId = lapId;
  }

  /**
   * Handle car telemetry data
   */
  handleCarTelemetry(
    header: PacketHeader,
    carTelemetryData: CarTelemetryData[],
    lapData: LapData[]
  ): void {
    if (!this.currentLapId) {
      return;
    }

    const playerIndex = header.playerCarIndex;
    const telemetryData = carTelemetryData[playerIndex];
    const playerLapData = lapData[playerIndex];

    if (!telemetryData || !playerLapData) {
      return;
    }

    const point: NewTelemetry = {
      lapId: this.currentLapId,
      distanceM: playerLapData.lapDistance,
      speedKph: telemetryData.speed,
      throttle: telemetryData.throttle,
      brake: telemetryData.brake,
      gear: telemetryData.gear,
      rpm: telemetryData.engineRPM,
      steering: telemetryData.steer,
      drs: telemetryData.drs,
      tireTempFL: telemetryData.tyresSurfaceTemperature[2], // FL is index 2
      tireTempFR: telemetryData.tyresSurfaceTemperature[3], // FR is index 3
      tireTempRL: telemetryData.tyresSurfaceTemperature[0], // RL is index 0
      tireTempRR: telemetryData.tyresSurfaceTemperature[1], // RR is index 1
      ersDeployed: null, // Will be filled from car status
      timestamp: Date.now(),
    };

    this.buffer.push(point);

    if (this.buffer.length >= this.BUFFER_SIZE) {
      this.flush();
    }
  }

  /**
   * Flush all buffered telemetry to the database
   */
  flush(): void {
    if (this.buffer.length === 0) {
      return;
    }

    const db = getDatabase();

    try {
      // Insert all buffered points
      for (const point of this.buffer) {
        db.insert(telemetry).values(point).run();
      }

      this.logger.debug({ count: this.buffer.length }, 'Flushed telemetry points');
      this.buffer = [];
    } catch (error) {
      this.logger.error({ error, count: this.buffer.length }, 'Failed to flush telemetry');
    }
  }

  /**
   * Reset state (e.g., on new lap or session)
   */
  reset(): void {
    this.flush();
    this.currentLapId = null;
  }
}

export default TelemetryWriter;
