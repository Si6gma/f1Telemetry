import { eq } from 'drizzle-orm';
import type { Logger } from 'pino';
import { sessions, type NewSession } from '../db/schema.js';
import { getDatabase } from '../db/client.js';
import { getTrackName, getSessionType, getWeather } from '../utils/trackMap.js';
import type { SessionPacket, PacketHeader } from '@f1t/types/packets';

/**
 * Manages session records in the database
 */
export class SessionWriter {
  private logger: Logger;
  private currentSessionId: string | null = null;

  constructor(logger: Logger) {
    this.logger = logger.child({ component: 'SessionWriter' });
  }

  /**
   * Handle a session packet - creates or updates session record
   */
  handleSession(header: PacketHeader, packet: SessionPacket): void {
    const sessionId = header.sessionUID.toString();
    const db = getDatabase();

    // Check if this is a new session
    if (this.currentSessionId !== sessionId) {
      // End previous session if exists
      if (this.currentSessionId) {
        this.endSession(this.currentSessionId);
      }

      // Create new session
      this.createSession(sessionId, packet);
      this.currentSessionId = sessionId;
    }
  }

  /**
   * End the current session (mark as ended)
   */
  endCurrentSession(): void {
    if (this.currentSessionId) {
      this.endSession(this.currentSessionId);
      this.currentSessionId = null;
    }
  }

  /**
   * Get the current session ID
   */
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  private createSession(sessionId: string, packet: SessionPacket): void {
    const db = getDatabase();
    
    const newSession: NewSession = {
      id: sessionId,
      trackId: packet.trackId,
      track: getTrackName(packet.trackId),
      sessionType: getSessionType(packet.sessionType),
      weather: getWeather(packet.weather),
      trackTemp: packet.trackTemperature,
      airTemp: packet.airTemperature,
      startedAt: Date.now(),
      endedAt: null,
    };

    try {
      // Check if session already exists (e.g., from reconnect)
      const existing = db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
      
      if (!existing) {
        db.insert(sessions).values(newSession).run();
        this.logger.info({ sessionId, track: newSession.track }, 'Created new session');
      } else {
        this.logger.info({ sessionId }, 'Resumed existing session');
      }
    } catch (error) {
      this.logger.error({ error, sessionId }, 'Failed to create session');
      throw error;
    }
  }

  private endSession(sessionId: string): void {
    const db = getDatabase();
    
    try {
      db.update(sessions)
        .set({ endedAt: Date.now() })
        .where(eq(sessions.id, sessionId))
        .run();
      
      this.logger.info({ sessionId }, 'Ended session');
    } catch (error) {
      this.logger.error({ error, sessionId }, 'Failed to end session');
    }
  }
}

export default SessionWriter;
