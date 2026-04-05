# @f1t/listener

UDP listener and packet parser for F1 23 telemetry data.

## Features

- UDP socket binding on configurable host/port
- Parses F1 23 packet types:
  - Car Telemetry (speed, throttle, brake, gear, RPM)
  - Lap Data (lap times, sector times, position)
  - Session (track, weather, temperature)
  - Car Status (tires, fuel, ERS)
  - Motion (position data for track map)
- Typed EventEmitter for downstream consumers
- Socket.io broadcaster for real-time dashboard

## Usage

```typescript
import { PacketEmitter, UDPSocket, SocketBroadcaster, createLogger } from '@f1t/listener';

const logger = createLogger('my-app');
const emitter = new PacketEmitter(logger);

// Subscribe to specific packet types
emitter.on('carTelemetry', (header, data) => {
  const playerCar = data.carTelemetryData[header.playerCarIndex];
  console.log(`Speed: ${playerCar.speed} km/h`);
});

// Start UDP listener
const udpSocket = new UDPSocket(emitter, logger, {
  host: '0.0.0.0',
  port: 20777,
});

// Start Socket.io broadcaster
const broadcaster = new SocketBroadcaster(emitter, logger, {
  port: 3002,
});

await broadcaster.start();
await udpSocket.start();
```

## Environment Variables

- `UDP_BIND_HOST` - Host to bind to (default: 0.0.0.0)
- `UDP_PORT` - UDP port to listen on (default: 20777)
- `WS_PORT` - Socket.io port (default: 3002)
- `LOG_LEVEL` - Logging level (default: info)

## Packet Structure

See `@f1t/types` for full type definitions.
