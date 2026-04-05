import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-f1-red">F1 Telemetry Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        <Link
          href="/live"
          className="p-6 bg-f1-gray rounded-lg hover:bg-f1-red transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Live Telemetry</h2>
          <p className="text-gray-300">Real-time data from F1 23</p>
        </Link>

        <Link
          href="/sessions"
          className="p-6 bg-f1-gray rounded-lg hover:bg-f1-red transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Sessions</h2>
          <p className="text-gray-300">View session history</p>
        </Link>

        <Link
          href="/compare"
          className="p-6 bg-f1-gray rounded-lg hover:bg-f1-red transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Compare Laps</h2>
          <p className="text-gray-300">Compare two laps</p>
        </Link>

        <Link
          href="/coach"
          className="p-6 bg-f1-gray rounded-lg hover:bg-f1-red transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">AI Coach</h2>
          <p className="text-gray-300">Get lap analysis</p>
        </Link>
      </div>

      <div className="mt-12 text-center text-gray-400">
        <p>Connect F1 23 telemetry to UDP port 20777</p>
        <p className="text-sm mt-2">API: http://localhost:3001 | WebSocket: http://localhost:3002</p>
      </div>
    </main>
  );
}
