'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LivePage() {
  const [connected, setConnected] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);

  useEffect(() => {
    // TODO: Connect to Socket.io server
    // For now, simulate data
    const interval = setInterval(() => {
      setSpeed(Math.floor(200 + Math.random() * 100));
      setGear(Math.floor(3 + Math.random() * 5));
      setRpm(Math.floor(8000 + Math.random() * 4000));
      setThrottle(Math.random());
      setBrake(Math.random() > 0.8 ? Math.random() * 0.5 : 0);
    }, 100);

    setConnected(true);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-f1-red">Live Telemetry</h1>
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-400">
          {connected ? 'Connected to F1 23' : 'Disconnected'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Speed */}
        <div className="bg-f1-gray p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm uppercase">Speed</h3>
          <div className="text-5xl font-bold mt-2">{speed}</div>
          <div className="text-gray-400">km/h</div>
        </div>

        {/* Gear */}
        <div className="bg-f1-gray p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm uppercase">Gear</h3>
          <div className="text-5xl font-bold mt-2">{gear}</div>
        </div>

        {/* RPM */}
        <div className="bg-f1-gray p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm uppercase">RPM</h3>
          <div className="text-5xl font-bold mt-2">{rpm.toLocaleString()}</div>
          <div className="w-full bg-gray-700 h-2 mt-2 rounded">
            <div
              className="bg-f1-red h-2 rounded transition-all"
              style={{ width: `${(rpm / 15000) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Throttle / Brake */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-f1-gray p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm uppercase mb-2">Throttle</h3>
          <div className="w-full bg-gray-700 h-4 rounded">
            <div
              className="bg-green-500 h-4 rounded transition-all"
              style={{ width: `${throttle * 100}%` }}
            />
          </div>
          <div className="text-right mt-1">{Math.round(throttle * 100)}%</div>
        </div>

        <div className="bg-f1-gray p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm uppercase mb-2">Brake</h3>
          <div className="w-full bg-gray-700 h-4 rounded">
            <div
              className="bg-red-500 h-4 rounded transition-all"
              style={{ width: `${brake * 100}%` }}
            />
          </div>
          <div className="text-right mt-1">{Math.round(brake * 100)}%</div>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm">
        <p>Live data visualization with charts coming soon...</p>
      </div>
    </main>
  );
}
