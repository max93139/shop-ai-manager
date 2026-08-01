'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { AuthProvider } from '../provider/authProvider';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
