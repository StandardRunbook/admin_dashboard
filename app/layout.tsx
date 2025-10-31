import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metrics to Log Streams Dashboard',
  description: 'Map metrics to log streams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
