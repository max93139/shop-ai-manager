import React from 'react';
import './globals.css';
import { StoreProvider } from '../store/provider';

export const metadata = {
  title: 'Admin Panel',
  description: 'Shop AI Manager Admin',
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
