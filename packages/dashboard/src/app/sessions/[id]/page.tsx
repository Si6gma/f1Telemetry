import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function SessionPage({ params }: Props) {
  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-f1-red">Session {params.id}</h1>
        <div className="flex gap-4">
          <Link href="/sessions" className="text-gray-400 hover:text-white">
            ← All Sessions
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
        </div>
      </div>

      <div className="bg-f1-gray p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Details</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-gray-400 text-sm">Track</div>
            <div>Silverstone</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Type</div>
            <div>Practice</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Weather</div>
            <div>Clear</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Temperature</div>
            <div>28°C Track / 22°C Air</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Laps</h2>
      <div className="bg-f1-gray rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-f1-dark">
            <tr>
              <th className="text-left p-4 text-gray-400">Lap #</th>
              <th className="text-left p-4 text-gray-400">Time</th>
              <th className="text-left p-4 text-gray-400">S1</th>
              <th className="text-left p-4 text-gray-400">S2</th>
              <th className="text-left p-4 text-gray-400">S3</th>
              <th className="text-left p-4 text-gray-400">Valid</th>
              <th className="text-left p-4 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((lap) => (
              <tr key={lap} className="border-t border-f1-dark">
                <td className="p-4">{lap}</td>
                <td className="p-4 font-mono">1:{27 + lap * 0.5}</td>
                <td className="p-4 font-mono">28.0</td>
                <td className="p-4 font-mono">32.0</td>
                <td className="p-4 font-mono">27.{lap}</td>
                <td className="p-4">
                  <span className="text-green-500">●</span>
                </td>
                <td className="p-4">
                  <Link href={`/laps/${lap}`} className="text-f1-red hover:underline">
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
