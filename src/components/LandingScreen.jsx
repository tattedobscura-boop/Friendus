import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import FeatureShowcase from './FeatureShowcase';

const AGE_GATE_KEY = 'vibematch_age_verified';

function AgeGate({ onConfirm, onDecline }) {
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)' }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-white font-black text-2xl mb-3">Access Restricted</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            You must be 18 or older to use FriendUs. Come back when you're ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#0e0e1a', border: '1px solid rgba(155,93,229,0.3)', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}>

        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ff2d78, #9b5de5, #00f5d4)' }} />

        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>✦</div>
            <span className="text-white font-black text-lg tracking-tight">FriendUs</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
            Before you enter
          </h2>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            FriendUs is a platform for adults. You must confirm your age and agree to our terms to continue.
          </p>

          {/* Age confirmation */}
          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}
                  className="sr-only" />
                <div className="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center"
                  style={{
                    borderColor: checked ? '#9b5de5' : 'rgba(255,255,255,0.25)',
                    background: checked ? 'linear-gradient(135deg, #ff2d78, #9b5de5)' : 'transparent',
                  }}>
                  {checked && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </div>
              <span className="text-white/80 text-sm leading-relaxed">
                I confirm that I am <span className="text-white font-bold">18 years of age or older</span> and I agree to the{' '}
                <span className="text-purple-400 underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-purple-400 underline cursor-pointer">Privacy Policy</span>.
              </span>
            </label>
          </div>

          {/* Safety notice */}
          <div className="rounded-xl p-3 mb-6 flex items-start gap-2.5"
            style={{ background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.15)' }}>
            <span className="text-base flex-shrink-0 mt-0.5">🛡️</span>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,245,212,0.8)' }}>
              FriendUs is a <strong>best-friends platform</strong>. Your face is never shown — only your interests and vibe matter. Content is filtered and monitored to keep this space safe and genuine.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { if (checked) onConfirm(); }}
              disabled={!checked}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all"
              style={{
                background: checked ? 'linear-gradient(135deg, #ff2d78, #9b5de5)' : 'rgba(255,255,255,0.07)',
                color: checked ? 'white' : 'rgba(255,255,255,0.3)',
                cursor: checked ? 'pointer' : 'not-allowed',
                boxShadow: checked ? '0 4px 20px rgba(155,93,229,0.35)' : 'none',
              }}>
              I'm 18+ — Enter FriendUs ✦
            </button>
            <button
              onClick={() => { setDeclined(true); onDecline(); }}
              className="w-full py-2.5 rounded-2xl text-xs font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.25)', background: 'transparent' }}>
              I'm under 18 — Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FLOATING_TAGS = [
  { text: '🎨 Art Lover', color: 'text-purple-300 border-purple-500/30', style: { top: '12%', left: '5%' } },
  { text: '☕ Coffee Snob', color: 'text-amber-300 border-amber-500/30', style: { top: '22%', right: '8%' } },
  { text: '🎮 Gamer', color: 'text-green-300 border-green-500/30', style: { top: '40%', left: '3%' } },
  { text: '📚 Bookworm', color: 'text-blue-300 border-blue-500/30', style: { top: '55%', right: '5%' } },
  { text: '🏄 Surfer', color: 'text-cyan-300 border-cyan-500/30', style: { top: '68%', left: '7%' } },
  { text: '🎷 Jazz Head', color: 'text-rose-300 border-rose-500/30', style: { top: '75%', right: '10%' } },
  { text: '🌿 Plant Parent', color: 'text-lime-300 border-lime-500/30', style: { top: '85%', left: '12%' } },
  { text: '🚀 Sci-Fi Fan', color: 'text-violet-300 border-violet-500/30', style: { top: '30%', left: '1%' } },
];

export default function LandingScreen() {
  const { setCurrentScreen } = useApp();
  const { isLoggedIn, currentAccount, signOut } = useAuth();
  const [hoveredCta, setHoveredCta] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab]   = useState('signup');
  const [ageVerified, setAgeVerified] = useState(
    () => sessionStorage.getItem(AGE_GATE_KEY) === 'true'
  );

  const handleAgeConfirm = () => {
    sessionStorage.setItem(AGE_GATE_KEY, 'true');
    setAgeVerified(true);
  };

  function openAuth(tab) {
    setAuthTab(tab);
    setShowAuth(true);
  }

  function handleAuthClose(result) {
    setShowAuth(false);
    // If signed in/up successfully, go straight to onboarding
    if (result === 'success') setCurrentScreen('onboarding');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      {!ageVerified && (
        <AgeGate onConfirm={handleAgeConfirm} onDecline={() => {}} />
      )}
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(ellipse, #9b5de5 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
        style={{ background: 'radial-gradient(ellipse, #ff2d78 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-8"
        style={{ background: 'radial-gradient(ellipse, #00f5d4 0%, transparent 70%)' }} />

      {/* Floating tags */}
      {FLOATING_TAGS.map((tag, i) => (
        <div
          key={i}
          className={`absolute hidden lg:flex items-center px-3 py-1.5 rounded-full border backdrop-blur-sm text-xs font-semibold ${tag.color}`}
          style={{
            ...tag.style,
            background: 'rgba(0,0,0,0.4)',
            animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {tag.text}
        </div>
      ))}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>
            ✦
          </div>
          <span className="text-white font-bold text-lg tracking-tight">FriendUs</span>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm hidden sm:inline">
              Hey, <span className="text-white font-semibold">{currentAccount?.alias}</span> 👋
            </span>
            <button
              className="btn-primary text-sm px-5 py-2"
              onClick={() => setCurrentScreen('app')}
            >Enter App →</button>
            <button className="btn-ghost text-xs px-3 py-2" onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-sm px-4 py-2" onClick={() => openAuth('signin')}>Sign In</button>
            <button
              className="btn-primary text-sm px-5 py-2"
              onClick={() => openAuth('signup')}
            >Create Account</button>
          </div>
        )}
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-6 py-8 sm:py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 sm:mb-8"
          style={{
            background: 'rgba(155, 93, 229, 0.15)',
            border: '1px solid rgba(155, 93, 229, 0.4)',
            color: '#c77dff',
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Your face is never important here.
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-none">
          <span className="text-white">Find your</span>
          <br />
          <span className="gradient-text">best friend.</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-white/50 max-w-xl mb-3 sm:mb-5 leading-relaxed">
          FriendUs is built for people looking for a <strong className="text-white/80">real, deep friendship</strong> —
          not a photo, not a look. Just shared passions, honest interests, and genuine connection.
        </p>
        <p className="text-xs sm:text-sm text-white/35 max-w-md mb-6 sm:mb-10 leading-relaxed">
          No selfies. No appearance ratings. Your face never enters the picture — only your vibe does.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-14 w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            className="btn-primary px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold"
            onClick={() => isLoggedIn ? setCurrentScreen('onboarding') : openAuth('signup')}
            onMouseEnter={() => setHoveredCta(true)}
            onMouseLeave={() => setHoveredCta(false)}
          >
            {hoveredCta ? '✦ Let\'s go →' : 'Find My Best Friend — Free'}
          </button>
          <button
            className="btn-ghost px-7 py-3.5 sm:py-4 text-sm sm:text-base"
            onClick={() => isLoggedIn ? setCurrentScreen('app') : openAuth('signin')}
          >
            {isLoggedIn ? 'Go to App →' : 'Sign In'}
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center max-w-lg">
          {[
            { icon: '🙈', text: 'Face-free always' },
            { icon: '🎭', text: 'Stay anonymous' },
            { icon: '✨', text: 'Interest vision boards' },
            { icon: '💚', text: 'Best friends only' },
            { icon: '🔒', text: 'Safe & filtered' },
          ].map((f, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}>
              <span>{f.icon}</span>
              <span className="font-medium">{f.text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/5 py-4 sm:py-6 px-5 sm:px-8 pb-safe">
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2 sm:gap-6">
          {[
            { n: '128K+', label: 'People' },
            { n: '4.2M',  label: 'Best friends made' },
            { n: '100%',  label: 'Face-free' },
            { n: '0',     label: 'Selfies allowed' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-2xl font-black gradient-text">{s.n}</div>
              <div className="text-xs text-white/40 font-medium mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {showAuth && <AuthModal onClose={handleAuthClose} defaultTab={authTab} />}
    </div>
  );
}
