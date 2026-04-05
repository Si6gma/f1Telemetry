'use client';

import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function LapPage({ params }: Props) {
  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-f1-red">Lap {params.id}</h1>
        <div className="flex gap-4">
          <Link href="/sessions/mock-session-1" className="text-gray-400 hover:text-white">
            ← Session
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-f1-gray p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Lap Time</div>
          <div className="text-2xl font-mono">1:27.456</div>
        </div>
        <div className="bg-f1-gray p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Sector 1</div>
          <div className="text-2xl font-mono">28.123</div>
        </div>
        <div className="bg-f1-gray p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Sector 2</div>
          <div className="text-2xl font-mono">32.456</div>
        </div>
        <div className="bg-f1-gray p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Sector 3</div>
          <div className="text-2xl font-mono">26.877</div>
        </div>
      </div>

      <div className="bg-f1-gray p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Telemetry</h2>
        <p className="text-gray-400">
          Telemetry charts (throttle, brake, speed, gear) will be displayed here.
        </p>
        {/* TODO: Add uPlot charts */}
      </div>
    </main>
  );
}
