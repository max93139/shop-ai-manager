import React from 'react';
import './globals.css';
import { StoreProvider } from '../store/provider';

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
    <html lang="uk">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
