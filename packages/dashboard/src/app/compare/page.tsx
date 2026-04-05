'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ComparePage() {
  const [lapA, setLapA] = useState('1');
  const [lapB, setLapB] = useState('2');
  const [loading, setLoading] = useState(false);

  const handleCompare = () => {
    setLoading(true);
    // TODO: Fetch comparison data from API
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-f1-red">Compare Laps</h1>
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-gray-400 mb-2">Lap A (Reference)</label>
          <input
            type="number"
            value={lapA}
            onChange={(e) => setLapA(e.target.value)}
            className="w-full bg-f1-gray p-4 rounded-lg text-white"
            placeholder="Lap ID"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-400 mb-2">Lap B (Comparison)</label>
          <input
            type="number"
            value={lapB}
            onChange={(e) => setLapB(e.target.value)}
            className="w-full bg-f1-gray p-4 rounded-lg text-white"
            placeholder="Lap ID"
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full bg-f1-red py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Compare Laps'}
      </button>

      <div className="mt-8 bg-f1-gray p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Comparison Results</h3>
        <p className="text-gray-400">
          Select two laps and click compare to see telemetry overlay and time delta.
        </p>
        {/* TODO: Add charts for throttle, brake, speed comparison */}
      </div>
    </main>
  );
}
