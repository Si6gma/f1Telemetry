# @f1t/logger

SQLite database and telemetry persistence for F1 23.

## Features

- SQLite database with Drizzle ORM
- Session logging (track, weather, session type)
- Lap logging (lap times, sector times, validity)
- High-frequency telemetry storage (speed, throttle, brake, gear, etc.)
- Lap completion detection
- Automatic database migrations

## Database Schema

### Sessions
- `id` - Session UID from F1 23
- `track` - Track name
- `session_type` - Practice, qualifying, race, etc.
- `weather`, `track_temp`, `air_temp` - Weather conditions
- `started_at`, `ended_at` - Session timestamps

### Laps
- `id` - Auto-increment lap ID
- `session_id` - Reference to session
- `lap_number` - Lap number in session
- `lap_time_ms`, `sector1_ms`, `sector2_ms`, `sector3_ms` - Timing data
- `is_valid` - Whether lap was valid (no cuts)
- `tire_compound` - Tyre compound used
- `fuel_load` - Fuel at start of lap

### Telemetry
- `lap_id` - Reference to lap
- `distance_m` - Distance around track
- `speed_kph`, `throttle`, `brake`, `gear`, `rpm`, `steering`, `drs`
- `tire_temp_fl`, `tire_temp_fr`, `tire_temp_rl`, `tire_temp_rr`
- `ers_deployed` - ERS usage

## Usage

```typescript
import { PacketEmitter, createLogger } from '@f1t/listener';
import { TelemetryLogger } from '@f1t/logger';

const logger = createLogger('my-app');
const emitter = new PacketEmitter(logger);

// Create logger with database
const telemetryLogger = new TelemetryLogger(emitter, {
  dbPath: './data/telemetry.db',
});

telemetryLogger.start();

// On shutdown
telemetryLogger.stop();
```

## Environment Variables

- `DB_PATH` - Path to SQLite database file (default: ./data/telemetry.db)
- `LOG_LEVEL` - Logging level (default: info)
