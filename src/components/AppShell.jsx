import React from 'react';
import { useApp } from '../context/AppContext';
import DiscoverTab from './tabs/DiscoverTab';
import VisionBoardTab from './tabs/VisionBoardTab';
import ConnectionsTab from './tabs/ConnectionsTab';
import ProfileTab from './tabs/ProfileTab';
import CallOverlay from './CallOverlay';

const TABS = [
  { id: 'discover', icon: '✦', label: 'Discover' },
  { id: 'board',    icon: '🎨', label: 'Boards'  },
  { id: 'connections', icon: '🤝', label: 'Friends' },
  { id: 'profile',  icon: '🎭', label: 'Profile' },
];

export default function AppShell() {
  const { activeTab, setActiveTab, connections, notifications, activeCall } = useApp();
  const connCount = connections.length;

  return (
    <>
      {/* ─── Full-screen shell ─── */}
      <div
        className="bg-[#0a0a0f] flex flex-col"
        style={{ height: '100dvh', overflow: 'hidden', position: 'relative' }}
      >
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

        {/* ── Desktop: two-column wrapper ── */}
        <div className="relative z-10 flex flex-1 overflow-hidden w-full max-w-6xl mx-auto">

          {/* ── Desktop sidebar nav (lg+) ── */}
          <aside
            className="hidden lg:flex flex-col gap-1 py-6 px-3 border-r border-white/5 flex-shrink-0"
            style={{ width: '72px', background: 'rgba(10,10,15,0.97)' }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black text-white"
                style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}
              >✦</div>
            </div>

            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const badge = tab.id === 'connections' && connCount > 0 ? connCount : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                  className="relative flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'rgba(155,93,229,0.18)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span className="text-xl"
                    style={{ filter: isActive ? 'drop-shadow(0 0 6px rgba(155,93,229,0.9))' : 'none' }}>
                    {tab.icon}
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                  {badge && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                      style={{ background: '#ff2d78', fontSize: '8px', color: 'white' }}
                    >{badge}</span>
                  )}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #ff2d78, #9b5de5)' }}
                    />
                  )}
                </button>
              );
            })}

            {/* Anonymous badge at bottom */}
            <div className="mt-auto flex flex-col items-center gap-1 opacity-50">
              <span className="text-lg">🔒</span>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.2 }}>
                Anon
              </span>
            </div>
          </aside>

          {/* ── Main column ── */}
          <div className="flex flex-col flex-1 min-w-0">

            {/* Top header */}
            <header
              className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 border-b border-white/5"
              style={{
                height: '56px',
                background: 'rgba(10,10,15,0.97)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-2 lg:hidden">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}
                >✦</div>
                <span className="text-white font-black tracking-tight text-sm">FriendUs</span>
              </div>
              {/* Desktop: show active tab title */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-white font-black text-base">
                  {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(0,245,212,0.08)',
                    border: '1px solid rgba(0,245,212,0.2)',
                    color: 'rgba(0,245,212,0.85)',
                  }}
                >
                  <span>🙈</span>
                  <span className="hidden sm:inline">Face-free</span>
                </div>
                {notifications > 0 && (
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                      <span className="text-sm">🔔</span>
                    </div>
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                      style={{ background: '#ff2d78', fontSize: '9px', color: 'white' }}
                    >{notifications}</span>
                  </div>
                )}
              </div>
            </header>

            {/* ── Scrollable content ── */}
            <main className="flex-1 overflow-hidden flex flex-col min-h-0">
              {activeTab === 'discover'     && <div className="h-full overflow-y-auto overscroll-contain"><DiscoverTab /></div>}
              {activeTab === 'board'        && <div className="h-full overflow-hidden flex flex-col"><VisionBoardTab /></div>}
              {activeTab === 'connections'  && <div className="h-full overflow-hidden flex flex-col"><ConnectionsTab /></div>}
              {activeTab === 'profile'      && <div className="h-full overflow-y-auto overscroll-contain"><ProfileTab /></div>}
            </main>

            {/* ── Bottom nav (mobile only) ── */}
            <nav
              className="lg:hidden flex-shrink-0 flex items-center justify-around border-t border-white/5 pb-safe"
              style={{
                background: 'rgba(10,10,15,0.97)',
                backdropFilter: 'blur(20px)',
                minHeight: '60px',
              }}
            >
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const badge = tab.id === 'connections' && connCount > 0 ? connCount : null;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative"
                    style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.35)' }}
                  >
                    <div className="relative">
                      <span
                        className="text-xl block"
                        style={{ filter: isActive ? 'drop-shadow(0 0 6px rgba(155,93,229,0.9))' : 'none' }}
                      >{tab.icon}</span>
                      {badge && (
                        <span
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
                          style={{ background: '#ff2d78', fontSize: '8px', color: 'white' }}
                        >{badge}</span>
                      )}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(90deg, #ff2d78, #9b5de5)' }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>{/* end main column */}
        </div>{/* end two-column */}
      </div>{/* end shell */}

      {/* Call overlay — outside shell so it covers everything */}
      {activeCall && <CallOverlay />}
    </>
  );
}
