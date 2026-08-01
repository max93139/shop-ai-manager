import React from 'react';
import Sidebar from './sidebar';
import Header from './header';
import Main from './main';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <Main>{children}</Main>
      </div>
    </div>
  );
}
