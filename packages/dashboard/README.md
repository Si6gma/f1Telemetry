# @f1t/dashboard

Next.js dashboard for F1 Telemetry visualization.

## Features (Planned)

- `/live` - Real-time telemetry view with Socket.io
- `/sessions` - Session history
- `/laps/[id]` - Single lap analysis
- `/compare` - Lap comparison
- `/coach` - AI coach interface

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client
- SWR (data fetching)
- Zustand (state management)

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `NEXT_PUBLIC_API_URL` - API server URL (default: http://localhost:3001)
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL (default: http://localhost:3002)
