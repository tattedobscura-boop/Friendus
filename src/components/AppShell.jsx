import React from 'react';
import { useApp } from '../context/AppContext';
import DiscoverTab from './tabs/DiscoverTab';
import VisionBoardTab from './tabs/VisionBoardTab';
import ConnectionsTab from './tabs/ConnectionsTab';
import ProfileTab from './tabs/ProfileTab';
import CallOverlay from './CallOverlay';

const TABS = [
  { id: 'discover', icon: '✦', label: 'Discover' },
  { id: 'board', icon: '🎨', label: 'Boards' },
  { id: 'connections', icon: '🤝', label: 'Friends' },
  { id: 'profile', icon: '🎭', label: 'Profile' },
];

export default function AppShell() {
  const { activeTab, setActiveTab, profile, connections, notifications, activeCall } = useApp();

  const connCount = connections.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col max-w-lg mx-auto relative">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/5"
        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>
            ✦
          </div>
          <span className="text-white font-black tracking-tight">VibeMatch</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Anonymous badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(0, 245, 212, 0.08)',
              border: '1px solid rgba(0, 245, 212, 0.2)',
              color: 'rgba(0, 245, 212, 0.8)',
            }}>
            <span>🔒</span>
            <span className="hidden sm:inline">Anonymous</span>
          </div>

          {/* Notification dot */}
          {notifications > 0 && (
            <div className="relative">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                <span className="text-sm">🔔</span>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: '#ff2d78', fontSize: '9px' }}>
                {notifications}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full" style={{ height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
          {activeTab === 'discover' && <div className="h-full overflow-y-auto"><DiscoverTab /></div>}
          {activeTab === 'board' && <div className="h-full overflow-hidden flex flex-col"><VisionBoardTab /></div>}
          {activeTab === 'connections' && <div className="h-full overflow-hidden flex flex-col"><ConnectionsTab /></div>}
          {activeTab === 'profile' && <div className="h-full overflow-y-auto"><ProfileTab /></div>}
        </div>
      </main>

      {/* Call overlay */}
      {activeCall && <CallOverlay />}

      {/* Bottom nav */}
      <nav className="relative z-20 border-t border-white/5 px-2 py-2 flex items-center justify-around"
        style={{
          background: 'rgba(10,10,15,0.97)',
          backdropFilter: 'blur(20px)',
        }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const badge = tab.id === 'connections' && connCount > 0 ? connCount : null;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="nav-item flex-1"
              style={isActive ? { color: 'white' } : {}}
            >
              <div className="relative">
                <span className={`text-xl transition-all ${isActive ? 'scale-110' : ''}`}
                  style={{ display: 'block', filter: isActive ? 'drop-shadow(0 0 8px rgba(155, 93, 229, 0.8))' : 'none' }}>
                  {tab.icon}
                </span>
                {badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ background: '#ff2d78', fontSize: '8px', color: 'white' }}>
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-0.5" style={{
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'white' : 'rgba(255,255,255,0.35)',
              }}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
