import React from 'react';
import Sidebar from './sidebar';
import Header from './header';
import Main from './main';

export { Sidebar, Header, Main };

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <Main>{children}</Main>
      </div>
    </div>
  );
}
