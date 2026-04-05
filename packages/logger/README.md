# @f1t/logger

SQLite database and telemetry persistence for F1 23.

## Status: Placeholder

This package is currently a placeholder due to better-sqlite3 compatibility issues with Node.js 25.

## Planned Implementation

When re-enabled, this package will provide:

- SQLite database with Drizzle ORM
- Session logging (track, weather, session type)
- Lap logging (lap times, sector times, validity)
- High-frequency telemetry storage
- Lap completion detection

## Alternative Approaches

1. Use native `node:sqlite` (available in Node.js 22+ as experimental)
2. Use `sqlite3` package instead of better-sqlite3
3. Downgrade Node.js to version compatible with better-sqlite3
