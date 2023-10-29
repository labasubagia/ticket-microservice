import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ReactQueryProvider from '@/providers/react-query';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ticketing',
  description: 'Buy ticket online easier than ever!',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <body className={inter.className}>{children}</body>
      </ReactQueryProvider>
    </html>
  );
}
