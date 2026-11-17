import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '../store/provider';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Shop AI Manager | Admin',
  description: 'Shop AI Manager Admin Panel',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${inter.className}`}>
      <body className={`${inter.variable} ${inter.className}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
