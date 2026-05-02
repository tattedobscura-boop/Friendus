import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CallOverlay() {
  const { activeCall, setActiveCall, getDaysConnected } = useApp();
  const [callState, setCallState] = useState('ringing'); // ringing | connected | ended
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(activeCall?.type === 'video');

  useEffect(() => {
    if (!activeCall) return;
    setCallState('ringing');
    setDuration(0);
    setCameraOn(activeCall.type === 'video');

    // Auto-answer after 2s (simulated)
    const answerTimer = setTimeout(() => setCallState('connected'), 2000);
    return () => clearTimeout(answerTimer);
  }, [activeCall]);

  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const handleEnd = () => {
    setCallState('ended');
    setTimeout(() => setActiveCall(null), 800);
  };

  if (!activeCall) return null;

  const user = activeCall.user;
  const isVideo = activeCall.type === 'video';
  const days = getDaysConnected(user);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between"
      style={{
        background: isVideo
          ? 'linear-gradient(180deg, #0a0010 0%, #1a0030 50%, #0a0010 100%)'
          : 'linear-gradient(180deg, #050510 0%, #0f0f2e 100%)',
      }}
    >
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-6 pt-safe pt-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span>{isVideo ? '📹' : '📞'}</span>
          <span className="text-white/70">{isVideo ? 'Video Call' : 'Voice Call'}</span>
        </div>
        {callState === 'connected' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(0, 245, 212, 0.1)', border: '1px solid rgba(0, 245, 212, 0.3)', color: '#00f5d4' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {formatDuration(duration)}
          </div>
        )}
      </div>

      {/* Center — avatar / video */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full px-6">

        {isVideo && cameraOn ? (
          // Simulated video feeds
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Their "camera" - abstract animated background */}
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: `linear-gradient(135deg, #0a0a0f, #1a0a2e, #0a1a2e)` }}>
              {/* Animated blobs to represent the "other person" without showing faces */}
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full animate-pulse"
                  style={{ background: 'radial-gradient(circle, rgba(155,93,229,0.3) 0%, transparent 70%)' }} />
                <div className={`w-full h-full rounded-full flex items-center justify-center text-5xl font-black text-white bg-gradient-to-br ${user.avatarColor}`}>
                  {user.avatar}
                </div>
              </div>
              <p className="text-white/40 text-sm mt-4 font-medium">Camera is abstract — no faces</p>
            </div>

            {/* Your camera (PiP) */}
            <div className="absolute top-4 right-4 w-20 h-28 rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)', border: '2px solid rgba(255,255,255,0.2)' }}>
              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white">
                You
              </div>
            </div>
          </div>
        ) : (
          // Voice call or camera off — large avatar
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Pulse rings */}
              {callState === 'connected' && (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgba(155,93,229,0.15)', animationDuration: '2s' }} />
                  <div className="absolute -inset-4 rounded-full animate-ping"
                    style={{ background: 'rgba(155,93,229,0.08)', animationDuration: '2.5s', animationDelay: '0.5s' }} />
                </>
              )}
              <div className={`relative w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br ${user.avatarColor}`}
                style={{ boxShadow: '0 0 40px rgba(155, 93, 229, 0.4)' }}>
                {user.avatar}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-black text-white">{user.alias}</h2>
              <p className="text-white/40 text-sm mt-1">
                {callState === 'ringing' ? '🔔 Calling...' :
                 callState === 'connected' ? `Connected · ${days} days friends` :
                 '📴 Call ended'}
              </p>
            </div>
          </div>
        )}

        {/* Shared vibes reminder */}
        {callState === 'connected' && (
          <div className="flex flex-wrap gap-1.5 justify-center max-w-xs">
            {user.likes.slice(0, 3).map((l, i) => (
              <span key={i} className="tag-like text-xs">{l}</span>
            ))}
          </div>
        )}

        {/* Ringing state */}
        {callState === 'ringing' && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-white/40 text-sm">Connecting...</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full px-6 pb-safe pb-10">
        {callState === 'connected' && (
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Mute */}
            <button
              onClick={() => setMuted(!muted)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
              style={{
                background: muted ? 'rgba(255,45,120,0.3)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${muted ? 'rgba(255,45,120,0.5)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >
              {muted ? '🔇' : '🎤'}
            </button>

            {/* Speaker */}
            <button
              onClick={() => setSpeakerOn(!speakerOn)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
              style={{
                background: speakerOn ? 'rgba(0, 245, 212, 0.15)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${speakerOn ? 'rgba(0, 245, 212, 0.3)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >
              {speakerOn ? '🔊' : '🔈'}
            </button>

            {/* Camera toggle (video only) */}
            {isVideo && (
              <button
                onClick={() => setCameraOn(!cameraOn)}
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
                style={{
                  background: cameraOn ? 'rgba(155, 93, 229, 0.2)' : 'rgba(255,45,120,0.2)',
                  border: `1px solid ${cameraOn ? 'rgba(155, 93, 229, 0.4)' : 'rgba(255,45,120,0.4)'}`,
                }}
              >
                {cameraOn ? '📹' : '📷'}
              </button>
            )}
          </div>
        )}

        {/* End call */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleEnd}
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-90"
            style={{
              background: 'linear-gradient(135deg, #ff2d78, #e50050)',
              boxShadow: '0 4px 30px rgba(255, 45, 120, 0.5)',
            }}
          >
            📵
          </button>
        </div>

        <p className="text-center text-white/20 text-xs mt-3">
          {isVideo ? '🔒 Abstract video — no face shown' : '🔒 Voice only — anonymous connection'}
        </p>
      </div>
    </div>
  );
}
