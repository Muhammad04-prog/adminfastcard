import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans select-none">
      <Header />

      {/* Main body area containing Sidebar and Pages */}
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />

        {/* Core content body of child pages */}
        <main className="flex-grow overflow-y-auto bg-[#f8fafc] p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
