import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../utils/mockData';

function MatchBadge({ score }) {
  const color = score >= 90 ? '#00f5d4' : score >= 75 ? '#9b5de5' : '#ff2d78';
  const label = score >= 90 ? 'Perfect Vibe' : score >= 75 ? 'Great Match' : 'Worth Checking';
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
      style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
      {score}% {label}
    </div>
  );
}

function UserCard({ user, onConnect, onPass, isTop }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(null);
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || startX.current === null) return;
    const diff = e.clientX - startX.current;
    setDragX(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (dragX > 80) {
      onConnect(user);
    } else if (dragX < -80) {
      onPass();
    }
    setDragX(0);
    startX.current = null;
  };

  const cardStyle = isTop ? {
    transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    zIndex: 10,
  } : {
    transform: 'scale(0.95) translateY(10px)',
    zIndex: 5,
  };

  const connectOpacity = Math.max(0, dragX / 80);
  const passOpacity = Math.max(0, -dragX / 80);

  return (
    <div
      ref={cardRef}
      className="match-card absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={cardStyle}
      onMouseDown={isTop ? handleMouseDown : undefined}
      onMouseMove={isTop ? handleMouseMove : undefined}
      onMouseUp={isTop ? handleMouseUp : undefined}
      onMouseLeave={isTop ? handleMouseUp : undefined}
    >
      {/* Swipe indicators */}
      {isTop && (
        <>
          <div className="absolute top-6 left-6 z-20 px-4 py-2 rounded-xl border-4 font-black text-2xl rotate-[-15deg]"
            style={{
              borderColor: '#00f5d4',
              color: '#00f5d4',
              opacity: connectOpacity,
              textShadow: '0 0 10px #00f5d4',
            }}>
            VIBE ✓
          </div>
          <div className="absolute top-6 right-6 z-20 px-4 py-2 rounded-xl border-4 font-black text-2xl rotate-[15deg]"
            style={{
              borderColor: '#ff2d78',
              color: '#ff2d78',
              opacity: passOpacity,
              textShadow: '0 0 10px #ff2d78',
            }}>
            PASS ✗
          </div>
        </>
      )}

      <div className="h-full flex flex-col overflow-y-auto">
        {/* Top section - avatar & match */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Avatar - no face, just initials with gradient */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white bg-gradient-to-br ${user.avatarColor} flex-shrink-0`}
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                {user.avatar}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{user.alias}</h3>
                <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                  <span>🔒</span> Anonymous profile
                </p>
              </div>
            </div>
            <MatchBadge score={user.matchScore} />
          </div>

          {/* Mini vision board */}
          <div className="mb-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Vision Board</p>
            <div className="grid grid-cols-3 gap-1.5">
              {user.visionBoard.slice(0, 6).map((item, i) => (
                <div key={i} className={`rounded-lg bg-gradient-to-br ${item.color} flex flex-col items-center justify-center p-2 aspect-square`}>
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-white text-xs font-semibold mt-0.5 text-center leading-tight" style={{ fontSize: '9px' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags section */}
        <div className="px-6 pb-4 space-y-3">
          {/* Likes */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              💚 Loves
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.likes.map((l, i) => (
                <span key={i} className="tag-like">{l}</span>
              ))}
            </div>
          </div>

          {/* Dislikes */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              🚫 Not their vibe
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.dislikes.map((l, i) => (
                <span key={i} className="tag-dislike">{l}</span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              🔮 Passions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((l, i) => (
                <span key={i} className="tag-interest">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isTop && (
          <div className="px-6 pb-6 mt-auto">
            <div className="flex gap-3">
              <button
                onClick={onPass}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255, 45, 120, 0.1)',
                  border: '1px solid rgba(255, 45, 120, 0.3)',
                  color: '#ff2d78',
                }}
              >
                Pass ✗
              </button>
              <button
                onClick={() => onConnect(user)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00f5d4, #9b5de5)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0, 245, 212, 0.3)',
                }}
              >
                Vibe ✓
              </button>
            </div>
            <p className="text-center text-white/20 text-xs mt-2">Or swipe ← → to pass / connect</p>
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

  const handleConnect = (user) => {
    addConnection(user);
    setMatchAnimation(user.alias);
    setTimeout(() => setMatchAnimation(null), 2000);
    setUsers(prev => prev.slice(1));
  };

  const handlePass = () => {
    setPassed(p => p + 1);
    setUsers(prev => prev.slice(1));
  };

  const refillUsers = () => {
    setUsers([...MOCK_USERS]);
    setPassed(0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Discover</h2>
            <p className="text-white/40 text-sm">Find friends by vibe, not by face</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(0, 245, 212, 0.1)',
              border: '1px solid rgba(0, 245, 212, 0.2)',
              color: '#00f5d4',
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {users.length} nearby
          </div>
        </div>

        {/* Profile tags preview */}
        {profile.likes.length > 0 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-white/30 text-xs flex-shrink-0">Matching on:</span>
            {profile.likes.slice(0, 3).map((l, i) => (
              <span key={i} className="tag-like flex-shrink-0">{l}</span>
            ))}
            {profile.likes.length > 3 && (
              <span className="text-white/30 text-xs flex-shrink-0">+{profile.likes.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      {/* Card stack */}
      <div className="flex-1 px-5 pb-5">
        {users.length > 0 ? (
          <div className="relative h-full" style={{ minHeight: '500px' }}>
            {/* Second card (behind) */}
            {users.length > 1 && (
              <UserCard
                key={users[1].id}
                user={users[1]}
                onConnect={() => {}}
                onPass={() => {}}
                isTop={false}
              />
            )}
            {/* Top card */}
            <UserCard
              key={users[0].id}
              user={users[0]}
              onConnect={handleConnect}
              onPass={handlePass}
              isTop={true}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-white font-black text-xl mb-2">You've seen everyone!</h3>
            <p className="text-white/40 text-sm mb-6">
              You passed {passed} profiles. More people are joining every day.
            </p>
            <button onClick={refillUsers} className="btn-primary px-6 py-3 text-sm">
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Match animation overlay */}
      {matchAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="text-center animate-bounce-in">
            <div className="text-6xl mb-3">✨</div>
            <div className="text-3xl font-black text-white mb-1">Vibe Match!</div>
            <div className="gradient-text font-bold text-lg">{matchAnimation} connected</div>
            <p className="text-white/50 text-sm mt-2">Say hi in connections!</p>
          </div>
        </div>
      )}
    </div>
  );
}
