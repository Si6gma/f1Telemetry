# F1 Telemetry Suite

A full telemetry suite for F1 23, running on a second laptop over LAN.

```
[Gaming PC - F1 23]
  → UDP broadcast to laptop IP:20777
      ↓
[Second Laptop]
  Node.js UDP Listener
      ↓              ↓
  SQLite DB     Socket.io (WebSocket)
      ↓              ↓
  REST API      Browser Dashboard (Next.js)
      ↓
  Claude API (AI Coach)
```

## Quick Start

### Development (One Command)

Run all services in a single terminal with colored output:

```bash
npm run dev
```

This starts:

- 🟦 **Listener** (UDP + WebSocket) on port 20777 / 3002
- 🟩 **API** (REST) on port 3001
- 🟪 **Dashboard** (Next.js) on port 3000

Press `Ctrl+C` to stop all services.

### Production (PM2)

Run all services as background processes with auto-restart and logging:

```bash
# Start all services
npm start

# View logs
npm run logs

# Stop all services
npm stop

# Restart all services
npm restart
```

## Manual Development

If you prefer running services separately:

```bash
# Terminal 1: UDP Listener
npm run start --workspace=@f1t/listener

# Terminal 2: REST API
npm run start --workspace=@f1t/api

# Terminal 3: Dashboard
npm run dev --workspace=@f1t/dashboard
```

## Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

| Variable         | Default | Description                  |
| ---------------- | ------- | ---------------------------- |
| `UDP_PORT`       | 20777   | UDP port for F1 23 telemetry |
| `API_PORT`       | 3001    | REST API port                |
| `WS_PORT`        | 3002    | WebSocket port for live data |
| `DASHBOARD_PORT` | 3000    | Dashboard port               |

## F1 23 Setup

1. In F1 23: Settings → Telemetry → UDP Telemetry **ON**
2. Set IP to your laptop's local IP (e.g., `192.168.x.x`)
3. Set port to `20777`
4. Both machines must be on the same network

## Project Structure

```
packages/
├── types/      # Shared TypeScript types
├── listener/   # UDP socket + packet parsers
├── logger/     # SQLite persistence (placeholder)
├── api/        # Fastify REST API
└── dashboard/  # Next.js frontend
```

## Available Scripts

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Start all services in dev mode (one terminal) |
| `npm start`      | Start all services with PM2 (production)      |
| `npm stop`       | Stop all PM2 services                         |
| `npm run logs`   | View PM2 logs                                 |
| `npm run build`  | Build all packages                            |
| `npm run lint`   | Run ESLint                                    |
| `npm run format` | Run Prettier                                  |

## License

MIT
