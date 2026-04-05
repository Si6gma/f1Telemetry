import type { Logger } from 'pino';
import type { LapData, PacketHeader } from '@f1t/types/packets';
import type { LapWriter } from '../writers/lapWriter.js';

interface LapState {
  lapNumber: number;
  lapTimeMs: number;
  sector1Ms: number;
  sector2Ms: number;
  isValid: boolean;
  completed: boolean;
}

/**
 * Detects lap completions from lap data packets
 */
export class LapDetector {
  private logger: Logger;
  private lapWriter: LapWriter;
  private sessionId: string | null = null;
  
  // Track lap state to detect completions
  private lapStates: Map<number, LapState> = new Map();
  private lastLapNumber: number = 0;
  private lastLapData: LapData | null = null;

  constructor(lapWriter: LapWriter, logger: Logger) {
    this.lapWriter = lapWriter;
    this.logger = logger.child({ component: 'LapDetector' });
  }

  /**
   * Set the current session ID
   */
  setSessionId(sessionId: string | null): void {
    this.sessionId = sessionId;
    this.reset();
  }

  /**
   * Handle lap data packet and detect lap completions
   */
  handleLapData(header: PacketHeader, lapData: LapData[]): void {
    if (!this.sessionId) {
      return;
    }

    const playerIndex = header.playerCarIndex;
    const playerLapData = lapData[playerIndex];

    if (!playerLapData) {
      return;
    }

    const currentLapNumber = playerLapData.currentLapNum;

    // Detect lap completion: when lap number increases
    if (currentLapNumber > this.lastLapNumber && this.lastLapNumber > 0 && this.lastLapData) {
      this.recordCompletedLap(this.lastLapNumber, this.lastLapData);
    }

    // Store current state
    this.lastLapNumber = currentLapNumber;
    this.lastLapData = playerLapData;

    // Track lap state for the current lap
    this.lapStates.set(currentLapNumber, {
      lapNumber: currentLapNumber,
      lapTimeMs: playerLapData.lastLapTimeInMS,
      sector1Ms: playerLapData.sector1TimeInMS,
      sector2Ms: playerLapData.sector2TimeInMS,
      isValid: playerLapData.currentLapInvalid === 0,
      completed: false,
    });
  }

  /**
   * Force record the current lap (e.g., on session end)
   */
  finalizeCurrentLap(): void {
    if (this.lastLapData && this.lastLapNumber > 0) {
      this.recordCompletedLap(this.lastLapNumber, this.lastLapData);
    }
  }

  /**
   * Reset state for new session
   */
  reset(): void {
    this.lapStates.clear();
    this.lastLapNumber = 0;
    this.lastLapData = null;
  }

  private recordCompletedLap(lapNumber: number, lapData: LapData): void {
    if (!this.sessionId) {
      return;
    }

    // Calculate sector 3 time from total lap time
    const lapTimeMs = lapData.lastLapTimeInMS;
    const sector1Ms = lapData.sector1TimeInMS;
    const sector2Ms = lapData.sector2TimeInMS;
    const sector3Ms = lapTimeMs > 0 && sector1Ms > 0 && sector2Ms > 0
      ? lapTimeMs - sector1Ms - sector2Ms
      : 0;

    const isValid = lapData.currentLapInvalid === 0;

    // Get fuel and tire data from lap start (stored in LapWriter)
    // For now, use placeholder values
    const fuelLoad = 0;
    const tireCompound = 'Unknown';

    this.logger.info(
      { 
        sessionId: this.sessionId, 
        lapNumber, 
        lapTimeMs: lapTimeMs / 1000,
        sector1: sector1Ms / 1000,
        sector2: sector2Ms / 1000,
        sector3: sector3Ms / 1000,
        isValid 
      },
      'Detected lap completion'
    );

    // Record the lap
    this.lapWriter.recordCompletedLap(
      this.sessionId,
      lapNumber,
      lapTimeMs,
      sector1Ms,
      sector2Ms,
      sector3Ms,
      isValid,
      fuelLoad,
      tireCompound
    );
  }
}

export default LapDetector;
