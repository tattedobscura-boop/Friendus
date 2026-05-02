import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CallOverlay() {
  const { activeCall, setActiveCall, getDaysConnected } = useApp();
  const [callState, setCallState] = useState('ringing');
  const [duration, setDuration]   = useState(0);
  const [muted, setMuted]         = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [cameraOn, setCameraOn]   = useState(false);

  useEffect(() => {
    if (!activeCall) return;
    setCallState('ringing');
    setDuration(0);
    setCameraOn(activeCall.type === 'video');
    const t = setTimeout(() => setCallState('connected'), 2000);
    return () => clearTimeout(t);
  }, [activeCall]);

  useEffect(() => {
    if (callState !== 'connected') return;
    const id = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(id);
  }, [callState]);

  const handleEnd = () => {
    setCallState('ended');
    setTimeout(() => setActiveCall(null), 700);
  };

  if (!activeCall) return null;

  const user    = activeCall.user;
  const isVideo = activeCall.type === 'video';
  const days    = getDaysConnected(user);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: isVideo
          ? 'linear-gradient(180deg,#0a0010 0%,#1a0030 60%,#0a0010 100%)'
          : 'linear-gradient(180deg,#050510 0%,#0f0f2e 100%)',
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 pt-safe"
        style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span>{isVideo ? '📹' : '📞'}</span>
          <span className="text-white/70">{isVideo ? 'Video Call' : 'Voice Call'}</span>
        </div>
        {callState === 'connected' && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.3)', color: '#00f5d4' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {formatDuration(duration)}
          </div>
        )}
      </div>

      {/* ── Center content ── */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 sm:gap-6 px-5 py-4 overflow-hidden">

        {isVideo && cameraOn ? (
          /* Video panel — capped so it never overflows on small screens */
          <div
            className="relative w-full rounded-3xl overflow-hidden flex-shrink-0"
            style={{
              maxWidth: '320px',
              aspectRatio: '9/14',
              maxHeight: '55vh',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Peer "camera" */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0a0a0f,#1a0a2e,#0a1a2e)' }}
            >
              <div className="relative" style={{ width: '120px', height: '120px' }}>
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ background: 'radial-gradient(circle,rgba(155,93,229,0.35) 0%,transparent 70%)' }}
                />
                <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br ${user.avatarColor}`}>
                  {user.avatar}
                </div>
              </div>
              <p className="text-white/35 text-xs mt-3 font-medium">Abstract — no faces shown</p>
            </div>

            {/* PiP self */}
            <div
              className="absolute top-3 right-3 rounded-xl overflow-hidden flex items-center justify-center text-lg font-black text-white"
              style={{
                width: '64px', height: '88px',
                background: 'linear-gradient(135deg,#ff2d78,#9b5de5)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >You</div>
          </div>
        ) : (
          /* Voice / camera-off avatar */
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              {callState === 'connected' && (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ background: 'rgba(155,93,229,0.4)', animationDuration: '2s' }} />
                  <div className="absolute -inset-5 rounded-full animate-ping opacity-10"
                    style={{ background: 'rgba(155,93,229,0.3)', animationDuration: '2.8s', animationDelay: '0.4s' }} />
                </>
              )}
              <div
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br ${user.avatarColor}`}
                style={{ boxShadow: '0 0 40px rgba(155,93,229,0.45)' }}
              >{user.avatar}</div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{user.alias}</h2>
              <p className="text-white/40 text-sm mt-1">
                {callState === 'ringing'   ? '🔔 Calling...'
               : callState === 'connected' ? `Connected · ${days} days friends`
               :                             '📴 Call ended'}
              </p>
            </div>

            {callState === 'ringing' && (
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shared vibes */}
        {callState === 'connected' && (
          <div className="flex flex-wrap gap-1.5 justify-center" style={{ maxWidth: '280px' }}>
            {user.likes.slice(0, 3).map((l, i) => (
              <span key={i} className="tag-like" style={{ fontSize: '11px' }}>{l}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div
        className="flex-shrink-0 px-6 pb-safe flex flex-col items-center gap-4"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {callState === 'connected' && (
          <div className="flex items-center gap-4">
            {/* Mute */}
            <button
              onClick={() => setMuted(!muted)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
              style={{
                background: muted ? 'rgba(255,45,120,0.3)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${muted ? 'rgba(255,45,120,0.5)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >{muted ? '🔇' : '🎤'}</button>

            {/* Speaker */}
            <button
              onClick={() => setSpeakerOn(!speakerOn)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
              style={{
                background: speakerOn ? 'rgba(0,245,212,0.15)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${speakerOn ? 'rgba(0,245,212,0.3)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >{speakerOn ? '🔊' : '🔈'}</button>

            {/* Camera toggle (video only) */}
            {isVideo && (
              <button
                onClick={() => setCameraOn(!cameraOn)}
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all active:scale-90"
                style={{
                  background: cameraOn ? 'rgba(155,93,229,0.2)' : 'rgba(255,45,120,0.2)',
                  border: `1px solid ${cameraOn ? 'rgba(155,93,229,0.4)' : 'rgba(255,45,120,0.4)'}`,
                }}
              >{cameraOn ? '📹' : '📷'}</button>
            )}
          </div>
        )}

        {/* End call */}
        <button
          onClick={handleEnd}
          className="w-18 h-18 rounded-full flex items-center justify-center text-3xl transition-all active:scale-90"
          style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg,#ff2d78,#e50050)',
            boxShadow: '0 4px 28px rgba(255,45,120,0.55)',
          }}
        >📵</button>

        <p className="text-white/20 text-xs text-center">
          {isVideo ? '🔒 Abstract video · no face' : '🔒 Voice only · anonymous'}
        </p>
      </div>
    </div>
  );
}
