import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

/**
 * Database client singleton
 */
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqliteInstance: Database.Database | null = null;

export interface DatabaseConfig {
  /** Path to SQLite database file */
  path?: string;
}

/**
 * Initialize the database connection
 */
export function initDatabase(config: DatabaseConfig = {}): ReturnType<typeof drizzle<typeof schema>> {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = config.path ?? process.env.DB_PATH ?? './data/telemetry.db';
  
  sqliteInstance = new Database(dbPath);
  sqliteInstance.pragma('journal_mode = WAL');
  
  dbInstance = drizzle(sqliteInstance, { schema });
  
  return dbInstance;
}

/**
 * Get the existing database instance
 */
export function getDatabase(): ReturnType<typeof drizzle<typeof schema>> {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

/**
 * Get the raw SQLite instance
 */
export function getSQLite(): Database.Database {
  if (!sqliteInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return sqliteInstance;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  sqliteInstance?.close();
  sqliteInstance = null;
  dbInstance = null;
}

/**
 * Run migrations to create tables
 */
export function migrate(): void {
  const sqlite = getSQLite();
  
  // Create sessions table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      track_id INTEGER NOT NULL,
      track TEXT NOT NULL,
      session_type TEXT NOT NULL,
      weather TEXT NOT NULL,
      track_temp INTEGER NOT NULL,
      air_temp INTEGER NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER
    )
  `);

  // Create laps table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS laps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      lap_number INTEGER NOT NULL,
      lap_time_ms INTEGER,
      sector1_ms INTEGER,
      sector2_ms INTEGER,
      sector3_ms INTEGER,
      is_valid INTEGER NOT NULL,
      tire_compound TEXT,
      fuel_load REAL,
      completed_at INTEGER,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
  `);

  // Create telemetry table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lap_id INTEGER NOT NULL,
      distance_m REAL NOT NULL,
      speed_kph REAL NOT NULL,
      throttle REAL NOT NULL,
      brake REAL NOT NULL,
      gear INTEGER NOT NULL,
      rpm INTEGER NOT NULL,
      steering REAL NOT NULL,
      drs INTEGER NOT NULL,
      tire_temp_fl REAL,
      tire_temp_fr REAL,
      tire_temp_rl REAL,
      tire_temp_rr REAL,
      ers_deployed REAL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (lap_id) REFERENCES laps(id)
    )
  `);

  // Create indexes for faster queries
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_laps_session ON laps(session_id);
    CREATE INDEX IF NOT EXISTS idx_telemetry_lap ON telemetry(lap_id);
    CREATE INDEX IF NOT EXISTS idx_telemetry_distance ON telemetry(lap_id, distance_m);
  `);
}
