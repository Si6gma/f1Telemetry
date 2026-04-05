# @f1t/api

Fastify REST API for F1 Telemetry data.

## Endpoints

### Health
- `GET /health` - Health check

### Sessions
- `GET /sessions` - List all sessions
- `GET /sessions/:id` - Get session with laps

### Laps
- `GET /laps/:id` - Get lap with telemetry data
- `GET /laps/compare?a=:id&b=:id` - Compare two laps

### Coach
- `POST /coach/analyse` - Analyse a lap (AI coach)
  ```json
  { "lapId": 1 }
  ```

## Status

Currently returns mock data. To be connected to database when @f1t/logger is fully implemented.

## Environment Variables

- `API_PORT` - Server port (default: 3001)
- `LOG_LEVEL` - Logging level (default: info)
