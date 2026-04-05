# F1 Telemetry Suite — Project Plan

## Overview

A full telemetry suite for F1 23, running on a second laptop over LAN.  
The game runs on a gaming PC and broadcasts UDP packets to the laptop's IP.  
The laptop runs the listener, logger, REST API, and browser dashboard.

This is a proper, long-lived project — not a one-time script. It is built to the standard of a professional codebase:
- Every package and module has a single, clear responsibility
- Files are kept small and focused — if a file is doing more than one thing, it gets split
- All public interfaces are documented with JSDoc
- Each package has its own README
- Shared types live in a dedicated `@f1t/types` package — no type duplication across packages
- Configuration is explicit and environment-driven (no hardcoded values)
- The project is set up for longevity: linting, formatting, and strict TypeScript from day one

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

---

## Network Setup

- In F1 23: Settings → Telemetry → UDP Telemetry ON, set IP to second laptop's local IP (e.g. `192.168.x.x`), port `20777`
- Listener binds to `0.0.0.0:20777` to accept packets from the network
- Both machines on the same home network (WiFi or ethernet)

---

## Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| Node.js + TypeScript | Runtime |
| `dgram` (built-in) | UDP listener |
| `fastify` | REST API |
| `socket.io` | Real-time WebSocket push to dashboard |
| `better-sqlite3` | Session and lap data storage |
| `zod` | Runtime schema validation on all external data (UDP packets, API inputs) |
| `drizzle-orm` | Type-safe query builder over SQLite — avoids raw SQL strings in app code |
| `pino` | Structured JSON logging across all packages |

### Frontend
| Tool | Purpose |
|---|---|
| Next.js (React) | Dashboard app |
| `uPlot` | High-frequency time-series charts (throttle, brake, speed) |
| `D3.js` | 2D track map with telemetry overlay |
| Tailwind CSS | Styling |
| `zustand` | Lightweight client state (live telemetry, selected laps) |
| `swr` | Data fetching + caching for REST API calls |

### Tooling (applies to all packages)
| Tool | Purpose |
|---|---|
| `typescript` (strict) | All packages compiled with `strict: true`, `noUncheckedIndexedAccess: true` |
| `eslint` + `@typescript-eslint` | Linting — shared config at root |
| `prettier` | Formatting — shared config at root |
| `vitest` | Unit tests |
| `tsup` | Build tool for backend packages |

---

## F1 23 UDP Packets (Priority Order)

F1 23 broadcasts ~16 packet types. We focus on these first:

| Packet | Data |
|---|---|
| **Car Telemetry** | Speed, throttle, brake, gear, RPM, steering, DRS |
| **Lap Data** | Current lap time, sector times, lap number, position |
| **Session** | Track, weather, session type, temperature |
| **Car Status** | Tire compound, fuel load, ERS mode, tire damage |
| **Motion** | Car position (x, y, z) — used for track map |

Later additions:
- Car Damage (damage per corner)
- Participants (driver names in multiplayer)
- Final Classification (race results)

---

## Project Structure

Each package is independently buildable, has its own `package.json`, and its own `README.md`. No file should exceed ~200 lines — if it does, it's a sign responsibility needs to be split.

```
f1Telemetry/
├── packages/
│   │
│   ├── types/                        # @f1t/types — shared across all packages
│   │   ├── src/
│   │   │   ├── packets/              # One file per F1 23 packet type
│   │   │   │   ├── header.ts         # PacketHeader type
│   │   │   │   ├── carTelemetry.ts
│   │   │   │   ├── lapData.ts
│   │   │   │   ├── session.ts
│   │   │   │   ├── carStatus.ts
│   │   │   │   ├── motion.ts
│   │   │   │   └── index.ts          # Re-exports all packet types
│   │   │   ├── domain/               # App-level domain types (not raw packet types)
│   │   │   │   ├── lap.ts
│   │   │   │   ├── session.ts
│   │   │   │   ├── telemetry.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts              # Package root export
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── listener/                     # @f1t/listener — UDP receiver + parser
│   │   ├── src/
│   │   │   ├── index.ts              # Entry point — creates socket, wires up pipeline
│   │   │   ├── socket/
│   │   │   │   └── udpSocket.ts      # Binds dgram socket, emits raw buffers
│   │   │   ├── parser/
│   │   │   │   ├── header.ts         # Reads packet header to determine type
│   │   │   │   ├── packets/          # One parser per packet type
│   │   │   │   │   ├── carTelemetry.ts
│   │   │   │   │   ├── lapData.ts
│   │   │   │   │   ├── session.ts
│   │   │   │   │   ├── carStatus.ts
│   │   │   │   │   └── motion.ts
│   │   │   │   └── index.ts          # Dispatches buffer → correct parser by packet ID
│   │   │   ├── emitter/
│   │   │   │   └── packetEmitter.ts  # Typed EventEmitter — one event per packet type
│   │   │   └── broadcaster/
│   │   │       └── socketBroadcaster.ts  # Socket.io server, relays typed events
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── logger/                       # @f1t/logger — persists telemetry to SQLite
│   │   ├── src/
│   │   │   ├── index.ts              # Wires listener events → writers
│   │   │   ├── db/
│   │   │   │   ├── client.ts         # better-sqlite3 + drizzle client singleton
│   │   │   │   ├── schema.ts         # Drizzle table definitions (source of truth)
│   │   │   │   └── migrate.ts        # Runs migrations on startup
│   │   │   ├── writers/              # One writer per domain entity
│   │   │   │   ├── sessionWriter.ts
│   │   │   │   ├── lapWriter.ts
│   │   │   │   └── telemetryWriter.ts
│   │   │   └── detection/
│   │   │       └── lapDetector.ts    # Detects lap start/end from Lap Data packets
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── api/                          # @f1t/api — Fastify HTTP server
│   │   ├── src/
│   │   │   ├── index.ts              # Server bootstrap — registers plugins + routes
│   │   │   ├── plugins/
│   │   │   │   ├── db.ts             # Fastify plugin: attaches DB to request context
│   │   │   │   └── cors.ts
│   │   │   ├── routes/
│   │   │   │   ├── sessions/
│   │   │   │   │   ├── index.ts      # Route registration
│   │   │   │   │   ├── list.ts       # GET /sessions
│   │   │   │   │   └── get.ts        # GET /sessions/:id
│   │   │   │   ├── laps/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── get.ts        # GET /laps/:id
│   │   │   │   │   └── compare.ts    # GET /laps/compare?a=:id&b=:id
│   │   │   │   └── coach/
│   │   │   │       ├── index.ts
│   │   │   │       └── analyse.ts    # POST /coach/analyse
│   │   │   ├── services/             # Business logic, separate from route handlers
│   │   │   │   ├── lapCompare.ts     # Interpolates two laps to same distance axis
│   │   │   │   └── coachService.ts   # Formats lap data, calls Claude API
│   │   │   └── schemas/              # Zod schemas for request/response validation
│   │   │       ├── lap.ts
│   │   │       └── session.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── dashboard/                    # @f1t/dashboard — Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx                    # → redirects to /live
│       │   │   ├── live/
│       │   │   │   ├── page.tsx
│       │   │   │   └── LiveDashboard.tsx       # Composes live widgets
│       │   │   ├── sessions/
│       │   │   │   └── page.tsx
│       │   │   ├── laps/
│       │   │   │   └── [id]/
│       │   │   │       ├── page.tsx
│       │   │   │       └── LapAnalysis.tsx
│       │   │   └── compare/
│       │   │       └── page.tsx
│       │   ├── components/
│       │   │   ├── charts/
│       │   │   │   ├── TelemetryChart.tsx      # uPlot wrapper
│       │   │   │   ├── DeltaChart.tsx          # Time delta by track distance
│       │   │   │   └── TrackMap.tsx            # D3 2D track map
│       │   │   ├── widgets/                    # Small, focused display units
│       │   │   │   ├── GearWidget.tsx
│       │   │   │   ├── DeltaTimer.tsx
│       │   │   │   ├── TireWidget.tsx
│       │   │   │   ├── ErsWidget.tsx
│       │   │   │   └── SectorSplits.tsx
│       │   │   ├── coach/
│       │   │   │   ├── CoachPanel.tsx
│       │   │   │   └── FeedbackCard.tsx
│       │   │   └── ui/                         # Generic reusable primitives
│       │   │       ├── Card.tsx
│       │   │       ├── Badge.tsx
│       │   │       └── Spinner.tsx
│       │   ├── hooks/
│       │   │   ├── useLiveTelemetry.ts         # Socket.io subscription hook
│       │   │   ├── useLapData.ts               # SWR fetch for a single lap
│       │   │   └── useSessionList.ts
│       │   ├── lib/
│       │   │   ├── socket.ts                   # Socket.io client singleton
│       │   │   └── api.ts                      # Typed API client (fetch wrappers)
│       │   └── store/
│       │       └── liveStore.ts                # Zustand store for live telemetry state
│       ├── package.json
│       └── README.md
│
├── .eslintrc.js                      # Shared ESLint config
├── .prettierrc                       # Shared Prettier config
├── tsconfig.base.json                # Shared TS config — extended by each package
├── package.json                      # Monorepo root (npm workspaces)
└── plan.md
```

---

## Dashboard Pages

### `/live` — Real-Time View
- Throttle, brake, speed as live scrolling traces (uPlot)
- Current gear, RPM bar
- Tire temp per wheel (color: blue=cold, green=optimal, red=hot)
- ERS deployment mode, DRS active indicator
- Delta timer vs best lap (green = gaining, red = losing)
- Current lap time + sector splits

### `/sessions` — Session Log
- List of all recorded sessions (track, date, session type)
- Best lap per session, total laps
- Click to drill into a session

### `/laps/[id]` — Single Lap Analysis
- Full throttle/brake/speed/gear trace plotted against **track distance (meters)** not time
- Braking point markers
- Sector breakdown with times
- Tire temp evolution through the lap

### `/compare` — Lap Comparison
- Select any two laps (e.g. your best vs latest)
- Overlaid traces: throttle, brake, speed — all on track distance X axis
- Delta chart showing where time is gained/lost corner by corner
- Track map showing both lines overlaid

### `/coach` — AI Coach
- Select a lap
- Hit "Analyse Lap"
- Sends full lap telemetry JSON to Claude API
- Returns specific, actionable feedback:
  - Where you're braking too early/late
  - Where throttle application is hurting you
  - Tire usage patterns
  - Consistency rating vs previous laps

---

## Data Storage Schema

```sql
-- One row per session
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,           -- sessionUID from F1 23
  track TEXT,
  session_type TEXT,             -- race, quali, practice
  weather TEXT,
  track_temp INTEGER,
  air_temp INTEGER,
  started_at INTEGER             -- unix timestamp
);

-- One row per lap
CREATE TABLE laps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  lap_number INTEGER,
  lap_time_ms INTEGER,
  sector1_ms INTEGER,
  sector2_ms INTEGER,
  sector3_ms INTEGER,
  is_valid INTEGER,              -- 1 = valid, 0 = invalid (cut track etc)
  tire_compound TEXT,
  fuel_load REAL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- High-frequency telemetry rows — one per UDP packet (~20hz)
CREATE TABLE telemetry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lap_id INTEGER,
  distance_m REAL,               -- track distance in meters (key for comparison)
  speed_kph REAL,
  throttle REAL,                 -- 0.0 to 1.0
  brake REAL,                    -- 0.0 to 1.0
  gear INTEGER,
  rpm INTEGER,
  steering REAL,                 -- -1.0 to 1.0
  drs INTEGER,                   -- 0 or 1
  tire_temp_fl REAL,
  tire_temp_fr REAL,
  tire_temp_rl REAL,
  tire_temp_rr REAL,
  ers_deployed REAL,
  FOREIGN KEY (lap_id) REFERENCES laps(id)
);
```

---

## AI Coach — How It Works

After a lap completes, the logger saves the full lap. In the dashboard you can trigger analysis:

1. API fetches the lap's telemetry rows from SQLite
2. Downsamples to ~1 row per 10m of track distance (keeps payload small)
3. Sends to Claude API with a structured prompt including:
   - Track name
   - Lap time vs best lap
   - Full telemetry table (distance, speed, throttle, brake, gear)
4. Claude returns specific feedback per corner/sector
5. Dashboard displays in the Coach panel

---

## Build Order

### Phase 1 — Listener + Logger
- [ ] Monorepo setup (npm workspaces, shared tsconfig)
- [ ] UDP listener — bind socket, receive raw buffers
- [ ] Packet header parser (identifies packet type)
- [ ] Parse Car Telemetry packet
- [ ] Parse Lap Data packet
- [ ] Parse Session packet
- [ ] Parse Car Status packet
- [ ] Parse Motion packet (for track map positions)
- [ ] EventEmitter connecting parser → downstream consumers
- [ ] SQLite schema + db init
- [ ] Session logger
- [ ] Lap logger (detect lap completion, save telemetry rows)

### Phase 2 — API + Real-Time
- [ ] Fastify API setup
- [ ] Socket.io server broadcasting live packets
- [ ] REST routes: sessions, laps, lap telemetry
- [ ] Lap comparison endpoint (returns two laps interpolated to same distance axis)

### Phase 3 — Dashboard
- [ ] Next.js app scaffold + Tailwind
- [ ] Socket.io client, live data hooks
- [ ] `/live` page — real-time charts and widgets
- [ ] `/sessions` page — session list
- [ ] `/laps/[id]` page — single lap analysis
- [ ] `/compare` page — lap comparison overlays
- [ ] Track map (D3) — 2D line, color-coded by speed

### Phase 4 — AI Coach
- [ ] Claude API integration
- [ ] Lap data serialization + prompt engineering
- [ ] `/coach` page — analysis UI

---

## Engineering Standards

### File size
No file should exceed ~200 lines. If it does, that's a signal that it's holding more than one responsibility. Split it.

### Single responsibility
Every file exports one primary thing. A route handler file handles one route. A writer writes one entity. A hook manages one piece of state.

### Documentation
- Every exported function and type has a JSDoc comment
- Each package has a `README.md` covering: what it does, how to run it, environment variables, and its public API
- Complex logic (packet parsing bit manipulation, lap interpolation algorithm) gets inline comments explaining the *why*, not the *what*

### Types
All types live in `@f1t/types`. No type is defined in more than one place. Raw F1 23 packet types (`packets/`) are kept separate from domain types (`domain/`) — domain types are what the rest of the app works with after parsing.

### Validation
All external data is validated at the boundary:
- UDP packet buffers are parsed with explicit length/offset checks
- API request inputs are validated with Zod schemas before reaching route logic
- No `any` casts; use `unknown` and narrow properly

### Configuration
No hardcoded values. All config (UDP port, DB path, Claude API key, Socket.io port) comes from environment variables, with a `.env.example` at the root.

### Testing
- Unit tests for all parsers — each packet parser has tests with real hex fixture data
- Unit tests for business logic (lap interpolation, lap detector)
- Integration tests for API routes against an in-memory SQLite DB

---

## Notes

- F1 23 sends packets at ~20Hz for most telemetry, ~60Hz for motion
- `sessionUID` in packet headers ties all packets to the same session — use this as the session primary key
- Track distance (`m_lapDistance` in Lap Data packet) is the X axis for all comparisons — never use timestamps for alignment
- Telemetry table will grow fast — consider pruning old sessions or archiving after 30 days
- `@f1t/types` is the only package with no dependencies on other local packages — everything else can depend on it
