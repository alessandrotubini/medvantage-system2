import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DemoBanner from './DemoBanner';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className={cn(
        'flex-1 min-h-screen transition-all duration-300 flex flex-col',
        collapsed ? 'ml-16' : 'ml-64'
      )}>
        <DemoBanner />
        <div className="p-6 animate-fade-in flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}