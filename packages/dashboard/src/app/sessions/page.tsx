import Link from 'next/link';

interface Session {
  id: string;
  track: string;
  sessionType: string;
  weather: string;
  laps: number;
  bestLap: string;
}

async function getSessions(): Promise<Session[]> {
  // TODO: Fetch from API
  return [
    {
      id: 'mock-session-1',
      track: 'Silverstone',
      sessionType: 'Practice',
      weather: 'Clear',
      laps: 24,
      bestLap: '1:27.456',
    },
  ];
}

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-f1-red">Sessions</h1>
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
      </div>

      <div className="bg-f1-gray rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-f1-dark">
            <tr>
              <th className="text-left p-4 text-gray-400">Track</th>
              <th className="text-left p-4 text-gray-400">Type</th>
              <th className="text-left p-4 text-gray-400">Weather</th>
              <th className="text-left p-4 text-gray-400">Laps</th>
              <th className="text-left p-4 text-gray-400">Best Lap</th>
              <th className="text-left p-4 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-t border-f1-dark">
                <td className="p-4">{session.track}</td>
                <td className="p-4">{session.sessionType}</td>
                <td className="p-4">{session.weather}</td>
                <td className="p-4">{session.laps}</td>
                <td className="p-4 font-mono">{session.bestLap}</td>
                <td className="p-4">
                  <Link
                    href={`/sessions/${session.id}`}
                    className="text-f1-red hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
