import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'F1 Telemetry Dashboard',
  description: 'Real-time F1 23 telemetry dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-f1-dark text-white">{children}</body>
    </html>
  );
}
