import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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
  const [hoveredCta, setHoveredCta] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
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
          <span className="text-white font-bold text-lg tracking-tight">VibeMatch</span>
        </div>
        <button
          className="btn-ghost text-sm px-5 py-2"
          onClick={() => setCurrentScreen('onboarding')}
        >
          Sign In
        </button>
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
          No face. No filter. Just vibes.
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-none">
          <span className="text-white">Friends found</span>
          <br />
          <span className="gradient-text">by what you love.</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-white/50 max-w-xl mb-6 sm:mb-10 leading-relaxed">
          VibeMatch connects you with friends who share your passions —
          zero photos, zero judgement. Build your vision board, share your interests,
          find your people.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-14 w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            className="btn-primary px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold"
            onClick={() => setCurrentScreen('onboarding')}
            onMouseEnter={() => setHoveredCta(true)}
            onMouseLeave={() => setHoveredCta(false)}
          >
            {hoveredCta ? '✦ Let\'s go →' : 'Find Your People — Free'}
          </button>
          <button
            className="btn-ghost px-7 py-3.5 sm:py-4 text-sm sm:text-base"
            onClick={() => setCurrentScreen('onboarding')}
          >
            See How It Works
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center max-w-lg">
          {[
            { icon: '🎭', text: 'Anonymous profiles' },
            { icon: '🚫', text: 'No face photos' },
            { icon: '✨', text: 'Vision boards' },
            { icon: '🤝', text: 'Friendship focused' },
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

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/5 py-4 sm:py-6 px-5 sm:px-8 pb-safe">
        <div className="max-w-2xl mx-auto grid grid-cols-4 gap-2 sm:gap-6">
          {[
            { n: '128K+', label: 'Users' },
            { n: '4.2M',  label: 'Friendships' },
            { n: '99%',   label: 'Anonymous' },
            { n: '0',     label: 'Face photos' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-2xl font-black gradient-text">{s.n}</div>
              <div className="text-xs text-white/40 font-medium mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
