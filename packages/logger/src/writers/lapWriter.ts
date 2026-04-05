import { eq, and, desc } from 'drizzle-orm';
import type { Logger } from 'pino';
import { laps, type NewLap } from '../db/schema.js';
import { getDatabase } from '../db/client.js';
import { getTyreCompound } from '../utils/trackMap.js';
import type { LapData, CarStatusData, PacketHeader } from '@f1t/types/packets';

interface LapInfo {
  lapData: LapData;
  carStatus: CarStatusData | null;
}

/**
 * Manages lap records in the database
 */
export class LapWriter {
  private logger: Logger;
  private currentLapNumber: number = 0;
  private lapStartData: Map<number, { fuelLoad: number; tireCompound: string }> = new Map();

  constructor(logger: Logger) {
    this.logger = logger.child({ component: 'LapWriter' });
  }

  /**
   * Handle lap data update
   * Creates a new lap record when we detect a new lap has started
   */
  handleLapData(
    sessionId: string,
    header: PacketHeader,
    lapData: LapData,
    carStatus: CarStatusData | null
  ): void {
    const playerIndex = header.playerCarIndex;
    const playerLapData = lapData[playerIndex];

    if (!playerLapData) {
      return;
    }

    const lapNumber = playerLapData.currentLapNum;

    // Detect new lap
    if (lapNumber > this.currentLapNumber && this.currentLapNumber > 0) {
      // Previous lap completed
      this.completePreviousLap(sessionId, header, this.currentLapNumber);
    }

    // Store lap start data
    if (lapNumber > 0 && !this.lapStartData.has(lapNumber)) {
      this.lapStartData.set(lapNumber, {
        fuelLoad: carStatus?.fuelInTank ?? 0,
        tireCompound: carStatus ? getTyreCompound(carStatus.actualTyreCompound) : 'Unknown',
      });
    }

    this.currentLapNumber = lapNumber;
  }

  /**
   * Complete the current lap manually (e.g., on session end)
   */
  completeCurrentLap(sessionId: string, header: PacketHeader): void {
    if (this.currentLapNumber > 0) {
      this.completePreviousLap(sessionId, header, this.currentLapNumber);
    }
  }

  /**
   * Get the current lap number
   */
  getCurrentLapNumber(): number {
    return this.currentLapNumber;
  }

  /**
   * Reset state (e.g., on new session)
   */
  reset(): void {
    this.currentLapNumber = 0;
    this.lapStartData.clear();
  }

  private completePreviousLap(sessionId: string, header: PacketHeader, lapNumber: number): void {
    const playerIndex = header.playerCarIndex;
    const lapInfo = this.lapStartData.get(lapNumber);

    if (!lapInfo) {
      return;
    }

    const db = getDatabase();

    // Check if lap already exists
    const existing = db
      .select()
      .from(laps)
      .where(and(eq(laps.sessionId, sessionId), eq(laps.lapNumber, lapNumber)))
      .get();

    if (existing) {
      // Lap already recorded
      return;
    }

    // We can't complete the lap here because we don't have the final lap data
    // The lap will be recorded when we receive the lap data showing the next lap
    // For now, just log that we're tracking this lap
    this.logger.debug({ sessionId, lapNumber }, 'Tracking lap start');
  }

  /**
   * Record a completed lap with full data
   * This should be called when we detect a lap completion
   */
  recordCompletedLap(
    sessionId: string,
    lapNumber: number,
    lapTimeMs: number,
    sector1Ms: number,
    sector2Ms: number,
    sector3Ms: number,
    isValid: boolean,
    fuelLoad: number,
    tireCompound: string
  ): number | null {
    const db = getDatabase();

    const newLap: NewLap = {
      sessionId,
      lapNumber,
      lapTimeMs,
      sector1Ms: sector1Ms || null,
      sector2Ms: sector2Ms || null,
      sector3Ms: sector3Ms || null,
      isValid,
      tireCompound,
      fuelLoad,
      completedAt: Date.now(),
    };

    try {
      const result = db.insert(laps).values(newLap).run();
      const lapId = Number(result.lastInsertRowid);
      
      this.logger.info(
        { sessionId, lapNumber, lapTimeMs: lapTimeMs / 1000, isValid, lapId },
        'Recorded lap'
      );

      return lapId;
    } catch (error) {
      this.logger.error({ error, sessionId, lapNumber }, 'Failed to record lap');
      return null;
    }
  }
}

export default LapWriter;
