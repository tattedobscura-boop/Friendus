import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../utils/mockData';

function MatchBadge({ score }) {
  const color = score >= 90 ? '#00f5d4' : score >= 75 ? '#9b5de5' : '#ff2d78';
  const label = score >= 90 ? 'Perfect Vibe' : score >= 75 ? 'Great Match' : 'New Vibe';
  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: color }} />
      {score}% {label}
    </div>
  );
}

function MiniVibeTile({ item }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-square" style={{ background: 'transparent' }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
      {item.img && !imgError && (
        <img
          src={item.img}
          alt={item.label}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-1 flex flex-col items-center">
        <span className="leading-none" style={{ fontSize: '12px' }}>{item.emoji}</span>
        <span className="text-white font-bold text-center leading-tight" style={{ fontSize: '7px' }}>{item.label}</span>
      </div>
    </div>
  );
}

function UserCard({ user, onConnect, onPass, isTop }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(null);
  const startY = useRef(null);
  const isScrolling = useRef(false);

  // ── Mouse ──
  const onMouseDown = useCallback((e) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging || startX.current === null) return;
    setDragX(e.clientX - startX.current);
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      if (dragX > 80) onConnect(user);
      else if (dragX < -80) onPass();
    }
    setIsDragging(false);
    setDragX(0);
    startX.current = null;
  }, [isDragging, dragX, onConnect, onPass, user]);

  // ── Touch ──
  const onTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isScrolling.current = false;
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    // If vertical scroll, don't intercept
    if (!isScrolling.current && Math.abs(dy) > Math.abs(dx)) {
      isScrolling.current = true;
      setIsDragging(false);
      setDragX(0);
      return;
    }
    if (!isScrolling.current) {
      e.preventDefault();
      setDragX(dx);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isScrolling.current && isDragging) {
      if (dragX > 60) onConnect(user);
      else if (dragX < -60) onPass();
    }
    setIsDragging(false);
    setDragX(0);
    startX.current = null;
    isScrolling.current = false;
  }, [isDragging, dragX, onConnect, onPass, user]);

  const cardStyle = isTop
    ? {
        transform: `translateX(${dragX}px) rotate(${dragX * 0.035}deg)`,
        transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 10,
        touchAction: 'pan-y',
      }
    : {
        transform: 'scale(0.96) translateY(8px)',
        zIndex: 5,
        pointerEvents: 'none',
      };

  const connectOpacity = Math.min(1, Math.max(0, dragX / 80));
  const passOpacity    = Math.min(1, Math.max(0, -dragX / 80));

  return (
    <div
      className="match-card absolute inset-0"
      style={{ ...cardStyle, cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default', userSelect: 'none' }}
      onMouseDown={isTop ? onMouseDown : undefined}
      onMouseMove={isTop ? onMouseMove : undefined}
      onMouseUp={isTop ? onMouseUp : undefined}
      onMouseLeave={isTop ? onMouseUp : undefined}
      onTouchStart={isTop ? onTouchStart : undefined}
      onTouchMove={isTop ? onTouchMove : undefined}
      onTouchEnd={isTop ? onTouchEnd : undefined}
    >
      {/* Swipe hint overlays */}
      {isTop && (
        <>
          <div
            className="absolute top-5 left-4 z-20 px-3 py-1.5 rounded-xl border-4 font-black text-xl rotate-[-15deg] pointer-events-none"
            style={{ borderColor: '#00f5d4', color: '#00f5d4', opacity: connectOpacity, textShadow: '0 0 10px #00f5d4' }}
          >VIBE ✓</div>
          <div
            className="absolute top-5 right-4 z-20 px-3 py-1.5 rounded-xl border-4 font-black text-xl rotate-[15deg] pointer-events-none"
            style={{ borderColor: '#ff2d78', color: '#ff2d78', opacity: passOpacity, textShadow: '0 0 10px #ff2d78' }}
          >PASS ✗</div>
        </>
      )}

      {/* Card scroll content */}
      <div className="h-full flex flex-col overflow-y-auto overscroll-contain">
        {/* Header row */}
        <div className="p-4 sm:p-5 pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-lg font-black text-white bg-gradient-to-br ${user.avatarColor} flex-shrink-0`}
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
              >{user.avatar}</div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-white truncate">{user.alias}</h3>
                <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                  <span>🔒</span> Anonymous
                </p>
              </div>
            </div>
            <MatchBadge score={user.matchScore} />
          </div>

          {/* Mini vision grid */}
          <div>
            <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2">Vision Board</p>
            <div className="grid grid-cols-3 gap-1.5">
              {user.visionBoard.slice(0, 6).map((item, i) => (
                <MiniVibeTile key={i} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Tag sections */}
        <div className="px-4 sm:px-5 pb-3 space-y-3 flex-shrink-0">
          {[
            { label: '💚 Loves',         tags: user.likes,     cls: 'tag-like' },
            { label: '🚫 Not their vibe', tags: user.dislikes,  cls: 'tag-dislike' },
            { label: '🔮 Passions',       tags: user.interests, cls: 'tag-interest' },
          ].map(({ label, tags, cls }) => (
            <div key={label}>
              <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-1.5">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t, i) => <span key={i} className={cls}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons pinned at bottom */}
        {isTop && (
          <div className="px-4 sm:px-5 pb-5 mt-auto flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={e => { e.stopPropagation(); onPass(); }}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', color: '#ff2d78' }}
              >Pass ✗</button>
              <button
                onClick={e => { e.stopPropagation(); onConnect(user); }}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #00f5d4, #9b5de5)', color: 'white', boxShadow: '0 4px 20px rgba(0,245,212,0.25)' }}
              >Vibe ✓</button>
            </div>
            <p className="text-center text-white/20 text-xs mt-2">Swipe or tap to connect / pass</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiscoverTab() {
  const { addConnection, profile } = useApp();
  const [users, setUsers] = useState([...MOCK_USERS]);
  const [matchAnimation, setMatchAnimation] = useState(null);
  const [passed, setPassed] = useState(0);

  const handleConnect = useCallback((user) => {
    addConnection(user);
    setMatchAnimation(user.alias);
    setTimeout(() => setMatchAnimation(null), 2000);
    setUsers(prev => prev.slice(1));
  }, [addConnection]);

  const handlePass = useCallback(() => {
    setPassed(p => p + 1);
    setUsers(prev => prev.slice(1));
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Tab header */}
      <div className="flex-shrink-0 px-4 sm:px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">Discover</h2>
            <p className="text-white/40 text-xs sm:text-sm">Find friends by vibe, not by face</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.2)', color: '#00f5d4' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {users.length} nearby
          </div>
        </div>

        {profile.likes.length > 0 && (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-0.5">
            <span className="text-white/30 text-xs flex-shrink-0">Matching on:</span>
            {profile.likes.slice(0, 3).map((l, i) => (
              <span key={i} className="tag-like flex-shrink-0 text-xs">{l}</span>
            ))}
            {profile.likes.length > 3 && (
              <span className="text-white/25 text-xs flex-shrink-0">+{profile.likes.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Card area — fills remaining space */}
      <div className="flex-1 min-h-0 px-4 sm:px-5 pb-4 sm:pb-5">
        {users.length > 0 ? (
          <div className="relative h-full">
            {users.length > 1 && (
              <UserCard key={users[1].id} user={users[1]} onConnect={() => {}} onPass={() => {}} isTop={false} />
            )}
            <UserCard key={users[0].id} user={users[0]} onConnect={handleConnect} onPass={handlePass} isTop />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-white font-black text-xl mb-2">You've seen everyone!</h3>
            <p className="text-white/40 text-sm mb-6">
              You passed {passed} profiles. More joining every day.
            </p>
            <button onClick={() => { setUsers([...MOCK_USERS]); setPassed(0); }} className="btn-primary px-6 py-3 text-sm">
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Match animation */}
      {matchAnimation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        >
          <div className="text-center">
            <div className="text-6xl mb-3">✨</div>
            <div className="text-3xl font-black text-white mb-1">Vibe Match!</div>
            <div className="gradient-text font-bold text-lg">{matchAnimation} connected</div>
            <p className="text-white/50 text-sm mt-2">Say hi in Friends!</p>
          </div>
        </div>
      )}
    </div>
  );
}
