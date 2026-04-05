'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CoachPage() {
  const [lapId, setLapId] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyse = async () => {
    if (!lapId) return;

    setLoading(true);
    
    // TODO: Call API
    setTimeout(() => {
      setAnalysis(
        `Analysis for lap ${lapId}:\n\n` +
        'Your lap was generally clean with good consistency. ' +
        'Key findings:\n' +
        '- Turn 3: Brake 10m later\n' +
        '- Turn 7: Apply throttle earlier\n' +
        '- Final sector: Excellent pace!'
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-f1-red">AI Coach</h1>
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <input
          type="number"
          value={lapId}
          onChange={(e) => setLapId(e.target.value)}
          placeholder="Enter Lap ID"
          className="flex-1 bg-f1-gray p-4 rounded-lg text-white"
        />
        <button
          onClick={handleAnalyse}
          disabled={loading || !lapId}
          className="bg-f1-red px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analysing...' : 'Analyse'}
        </button>
      </div>

      {analysis && (
        <div className="bg-f1-gray p-6 rounded-lg whitespace-pre-wrap">
          {analysis}
        </div>
      )}

      <div className="mt-8 text-gray-400 text-sm">
        <p>Powered by Claude API - Analysis based on telemetry data.</p>
      </div>
    </main>
  );
}
