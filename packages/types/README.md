# @f1t/types

Shared TypeScript types for the F1 Telemetry Suite.

## Structure

- `packets/` - Raw F1 23 UDP packet type definitions
- `domain/` - App-level domain types (Session, Lap, Telemetry)

## Usage

```typescript
import { Packets, Domain } from '@f1t/types';

// Raw packet types
const header: Packets.PacketHeader = {
  packetFormat: 2023,
  sessionUID: 12345n,
  // ...
};

// Domain types
const session: Domain.Session = {
  id: 'session-123',
  track: 'Silverstone',
  type: 'race',
  // ...
};
```

## Packet Types

- `PacketHeader` - Common header for all packets
- `CarTelemetryPacket` / `CarTelemetryData` - Speed, throttle, brake, gear, RPM
- `LapDataPacket` / `LapData` - Lap times, sector times, position
- `SessionPacket` - Track, weather, temperature
- `CarStatusPacket` / `CarStatusData` - Tires, fuel, ERS
- `MotionPacket` / `CarMotionData` - Position data for track map

## Domain Types

- `Session` - A racing session with metadata
- `Lap` - A completed lap with times
- `TelemetryPoint` - Single point of telemetry data
- `LiveTelemetry` - Real-time telemetry snapshot
