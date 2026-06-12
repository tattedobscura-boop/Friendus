import React, { useState } from 'react';

/* ── How it works steps ─────────────────────────────────────────────── */
const STEPS = [
  {
    icon: '🎭',
    emoji: '1',
    title: 'Create Your Anonymous Profile',
    desc: 'Make a profile using only your interests — no photos, no face, no name required.',
    color: '#ff2d78',
  },
  {
    icon: '🎨',
    emoji: '2',
    title: 'Build Your Vibe Boards',
    desc: 'Curate vision boards of what you love, what you value, and what you want in a friend.',
    color: '#9b5de5',
  },
  {
    icon: '✦',
    emoji: '3',
    title: 'Discover by Interest',
    desc: 'Swipe through people matched by shared passions — not looks.',
    color: '#00f5d4',
  },
  {
    icon: '🤝',
    emoji: '4',
    title: 'Chat, Call & Grow Together',
    desc: 'Build genuine bonds through text, voice, and video calls that unlock at 90 days.',
    color: '#ff2d78',
  },
];

/* ── Feature cards ──────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🙈',
    title: 'Face-Free Profiles',
    desc: 'No photos, no selfies, no appearance. Your personality is your profile.',
    gradient: 'from-pink-600 to-rose-700',
    tag: 'Core',
    tagColor: '#ff2d78',
  },
  {
    icon: '✦',
    title: 'Interest Matching',
    desc: 'Get matched by what you love — shared likes, passions, and values.',
    gradient: 'from-purple-600 to-fuchsia-700',
    tag: 'Core',
    tagColor: '#9b5de5',
  },
  {
    icon: '🎨',
    title: 'Vibe Board',
    desc: 'A visual mosaic of everything that represents you — no face needed.',
    gradient: 'from-violet-600 to-purple-800',
    tag: 'Core',
    tagColor: '#9b5de5',
  },
  {
    icon: '✨',
    title: 'Discovery Board',
    desc: 'Auto-populates from chat prompts — uncover new sides of yourself through conversation.',
    gradient: 'from-cyan-600 to-teal-700',
    tag: 'Core',
    tagColor: '#00f5d4',
  },
  {
    icon: '💚',
    title: 'Green Flag Tracker',
    desc: 'Log the qualities that matter most — great listeners, consistency, emotional availability.',
    gradient: 'from-green-600 to-emerald-700',
    tag: 'Premium',
    tagColor: '#22c55e',
  },
  {
    icon: '🚩',
    title: 'Red Flag Tracker',
    desc: 'Spot and log patterns that aren\'t okay. Protect your peace, know your dealbreakers.',
    gradient: 'from-red-600 to-rose-700',
    tag: 'Premium',
    tagColor: '#ff2d78',
  },
  {
    icon: '💬',
    title: 'Smart Chat + Prompts',
    desc: 'Conversation starters and discovery prompts that make every chat meaningful.',
    gradient: 'from-indigo-600 to-violet-700',
    tag: 'Core',
    tagColor: '#818cf8',
  },
  {
    icon: '📞',
    title: 'Voice Calls',
    desc: 'Anonymous voice calls — hear the person, not the appearance.',
    gradient: 'from-teal-600 to-cyan-700',
    tag: 'Core',
    tagColor: '#00f5d4',
  },
  {
    icon: '📹',
    title: 'Video Calls (90-Day Rule)',
    desc: 'Video unlocks after 90 days of friendship — trust built before faces are shared.',
    gradient: 'from-blue-600 to-indigo-700',
    tag: 'Core',
    tagColor: '#60a5fa',
  },
  {
    icon: '🛡️',
    title: 'Content Safety Filter',
    desc: 'AI-powered filtering blocks inappropriate content. Every message is screened.',
    gradient: 'from-slate-600 to-gray-700',
    tag: 'Core',
    tagColor: '#94a3b8',
  },
  {
    icon: '✨',
    title: 'Premium Badge & Benefits',
    desc: 'Unlimited cards, priority discovery, profile badge, and full board access.',
    gradient: 'from-amber-600 to-orange-700',
    tag: 'Premium',
    tagColor: '#f59e0b',
  },
  {
    icon: '🔐',
    title: 'Full Anonymity',
    desc: 'Your identity is always protected. No names, no photos, no location tracking.',
    gradient: 'from-emerald-600 to-teal-700',
    tag: 'Core',
    tagColor: '#00f5d4',
  },
];

/* ── Science facts ──────────────────────────────────────────────────── */
const SCIENCE_FACTS = [
  {
    stat: '68%',
    label: 'lower stress',
    detail: 'People with strong friendships report significantly lower cortisol levels.',
    emoji: '🧠',
    color: '#00f5d4',
  },
  {
    stat: '↑ 47%',
    label: 'oxytocin boost',
    detail: 'Shared interests and bonding activities trigger oxytocin — the "trust molecule."',
    emoji: '💞',
    color: '#ff2d78',
  },
  {
    stat: '50%',
    label: 'longer lifespan',
    detail: 'Strong social connections are linked to a 50% increased likelihood of longevity.',
    emoji: '📈',
    color: '#9b5de5',
  },
  {
    stat: '2x',
    label: 'happier days',
    detail: 'People with aligned interests report twice as many positive emotional experiences.',
    emoji: '☀️',
    color: '#fbbf24',
  },
  {
    stat: '3 min',
    label: 'to feel connected',
    detail: 'Bonding over shared passions can trigger dopamine release in under 3 minutes.',
    emoji: '⚡',
    color: '#00f5d4',
  },
  {
    stat: '90%',
    label: 'of happiness',
    detail: 'Social relationships are the #1 predictor of happiness according to Harvard research.',
    emoji: '🏆',
    color: '#c77dff',
  },
];

/* ── Feature Card Component ─────────────────────────────────────────── */
function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col"
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`
          : `rgba(255,255,255,0.03)`,
        border: `1px solid ${
          hovered ? 'rgba(155,93,229,0.35)' : 'rgba(255,255,255,0.07)'
        }`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(155,93,229,0.12)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-xl flex-shrink-0`}
          style={{ boxShadow: `0 4px 16px ${feature.tagColor}30` }}
        >
          {feature.icon}
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: `${feature.tagColor}15`,
            border: `1px solid ${feature.tagColor}30`,
            color: feature.tagColor,
          }}
        >
          {feature.tag}
        </span>
      </div>
      <h3 className="text-white font-bold text-sm sm:text-base mb-1.5 leading-snug">{feature.title}</h3>
      <p className="text-white/45 text-xs sm:text-sm leading-relaxed flex-1">{feature.desc}</p>
    </div>
  );
}

/* ── Step Card ──────────────────────────────────────────────────────── */
function StepCard({ step, index }) {
  return (
    <div className="flex flex-col items-center text-center px-3">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 font-black text-white relative"
        style={{
          background: `linear-gradient(135deg, ${step.color}, ${step.color}88)`,
          boxShadow: `0 4px 20px ${step.color}35`,
        }}
      >
        {step.icon}
        {index < 3 && (
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: '#0a0a0f', border: '2px solid rgba(255,255,255,0.15)' }}
          >
            {index + 1}
          </div>
        )}
      </div>
      <h3 className="text-white font-bold text-sm sm:text-base mb-1.5 leading-snug">{step.title}</h3>
      <p className="text-white/45 text-xs sm:text-sm leading-relaxed max-w-xs">{step.desc}</p>
    </div>
  );
}

/* ── Science Stat Card ──────────────────────────────────────────────── */
function ScienceCard({ fact }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))`,
        border: `1px solid ${fact.color}25`,
        boxShadow: `0 0 30px ${fact.color}08`,
      }}
    >
      <div className="text-3xl mb-2">{fact.emoji}</div>
      <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color: fact.color }}>
        {fact.stat}
      </div>
      <p className="text-white font-bold text-sm mb-1.5">{fact.label}</p>
      <p className="text-white/40 text-xs leading-relaxed">{fact.detail}</p>
    </div>
  );
}

/* ── Premium comparison row ─────────────────────────────────────────── */
const COMPARE_ROWS = [
  { feature: 'Anonymous profile', free: true, premium: true },
  { feature: 'Interest matching', free: true, premium: true },
  { feature: 'Vibe Board', free: true, premium: true },
  { feature: 'Discovery Board', free: true, premium: true },
  { feature: 'Smart Chat + Prompts', free: true, premium: true },
  { feature: 'Voice calls', free: true, premium: true },
  { feature: 'Video calls (90-day rule)', free: true, premium: true },
  { feature: 'Content safety filter', free: true, premium: true },
  { feature: 'Green Flag Tracker', free: false, premium: true },
  { feature: 'Red Flag Tracker', free: false, premium: true },
  { feature: 'Unlimited daily cards', free: false, premium: true },
  { feature: 'Priority discovery', free: false, premium: true },
  { feature: 'Premium profile badge', free: false, premium: true },
];

/* ── Main component ─────────────────────────────────────────────────── */
export default function FeatureShowcase() {
  return (
    <div className="relative z-10 w-full" style={{ background: '#0a0a0f' }}>
      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(155,93,229,0.4), transparent)' }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: How It Works
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(155,93,229,0.12)',
                border: '1px solid rgba(155,93,229,0.3)',
                color: '#c77dff',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              From strangers to{' '}
              <span className="gradient-text">best friends</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              No photos, no profiles, no pressure. Just four steps to a friendship that actually means something.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STEPS.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.3), transparent)' }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: All Features
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(0,245,212,0.1)',
                border: '1px solid rgba(0,245,212,0.3)',
                color: '#00f5d4',
              }}
            >
              ✦ Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              Built for{' '}
              <span className="gradient-text">real bonds</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Every feature on FriendUs is designed to strip away appearances and amplify what actually matters — who you are.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,45,120,0.3), transparent)' }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: The Science of Connection (Oxytocin / Mental Health)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-24 px-5 sm:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #ff2d78 0%, #9b5de5 40%, #00f5d4 70%, transparent 100%)' }}
        />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12 sm:mb-16">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(255,45,120,0.1)',
                border: '1px solid rgba(255,45,120,0.25)',
                color: '#ff2d78',
              }}
            >
              🧠 The Science
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              Connection is{' '}
              <span className="gradient-text">biological</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4">
              Finding people who share your interests isn't just fun — it changes your brain chemistry.
            </p>
            <div
              className="inline-block max-w-xl mx-auto rounded-xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed"
              style={{
                background: 'rgba(155,93,229,0.06)',
                border: '1px solid rgba(155,93,229,0.15)',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              <span className="text-lg mr-1">💞</span>{' '}
              When you discover shared interests, your brain releases{' '}
              <strong className="text-white">oxytocin</strong> — the "bonding hormone" that lowers stress, builds
              trust, and makes you feel genuinely connected. Less stress. More{' '}
              <strong className="text-white">real friendship</strong>.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SCIENCE_FACTS.map((fact, i) => (
              <ScienceCard key={i} fact={fact} />
            ))}
          </div>

          {/* Harvard research tag */}
          <div className="mt-8 text-center">
            <p className="text-white/25 text-xs leading-relaxed max-w-lg mx-auto">
              Based on research from Harvard Study of Adult Development, UCLA Social Neuroscience Lab,
              and Journal of Social & Personal Relationships.
            </p>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(155,93,229,0.4), transparent)' }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: Privacy Promise
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: 'rgba(0,245,212,0.1)',
                  border: '1px solid rgba(0,245,212,0.3)',
                  color: '#00f5d4',
                }}
              >
                🔒 Privacy First
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Your face is{' '}
                <span className="gradient-text">never the point</span>
              </h2>
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-5">
                FriendUs was built from the ground up around one belief: the best friendships aren't
                formed by looking at someone — they're formed by{' '}
                <strong className="text-white">connecting with someone</strong>.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: '🙈', text: 'No face photos — ever. On any board, in any chat.' },
                  { icon: '🎭', text: 'Anonymous aliases — your real identity stays hidden.' },
                  { icon: '🛡️', text: 'AI content filtering keeps every conversation safe.' },
                  { icon: '📹', text: 'Video calls unlock at 90 days — trust before faces.' },
                  { icon: '🔒', text: 'Your boards are private. Green flags, red flags — yours alone.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-white/60 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(155,93,229,0.08), rgba(255,45,120,0.04))',
                border: '1px solid rgba(155,93,229,0.2)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #ff2d78, transparent)' }}
              />

              <div className="text-center mb-5">
                <div className="text-4xl mb-2">❤️</div>
                <h3 className="text-white font-black text-lg mb-1">The 90-Day Rule</h3>
                <p className="text-white/40 text-xs leading-relaxed">
                  We believe trust takes time. Video calls unlock only after 90 days of friendship —
                  ensuring you've built a real bond before ever seeing each other's face.
                </p>
              </div>

              {/* Visual progress indicator */}
              <div className="space-y-3">
                {[
                  { day: 'Day 1', label: 'Match by interest', active: true },
                  { day: 'Day 7', label: 'Voice call unlocks', active: true },
                  { day: 'Day 30', label: 'Deeper conversations', active: false },
                  { day: 'Day 60', label: 'Trust builds', active: false },
                  { day: 'Day 90', label: '✨ Video unlocks', active: false },
                ].map((milestone, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${milestone.active ? '' : 'opacity-30'}`}
                      style={{
                        background: milestone.active ? '#00f5d4' : 'rgba(255,255,255,0.2)',
                        boxShadow: milestone.active ? '0 0 8px rgba(0,245,212,0.6)' : 'none',
                      }}
                    />
                    <span
                      className="text-xs font-bold flex-shrink-0"
                      style={{ color: milestone.active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', minWidth: '55px' }}
                    >
                      {milestone.day}
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full"
                      style={{
                        background: milestone.active
                          ? 'linear-gradient(90deg, #00f5d4, #9b5de5)'
                          : 'rgba(255,255,255,0.06)',
                      }}
                    />
                    <span
                      className="text-xs font-medium flex-shrink-0"
                      style={{ color: milestone.active ? '#00f5d4' : 'rgba(255,255,255,0.2)' }}
                    >
                      {milestone.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: Premium Comparison
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              ✨ Free vs Premium
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              Start free.{' '}
              <span className="gradient-text">Grow premium.</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              All the core features are free. Premium unlocks deeper friendship tools for those who want more.
            </p>
          </div>

          <div
            className="rounded-3xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Header row */}
            <div
              className="grid grid-cols-[1fr_80px_100px] gap-3 px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}
            >
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center" style={{ color: '#c77dff' }}>Premium</span>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_80px_100px] gap-3 items-center px-4 sm:px-6 py-3 text-sm"
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ color: row.free ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)' }}>
                  {row.feature}
                </span>
                <span className="text-center text-sm" style={{ color: row.free ? '#00f5d4' : 'rgba(255,255,255,0.15)' }}>
                  {row.free ? '✓' : '—'}
                </span>
                <span className="text-center text-sm" style={{ color: '#9b5de5' }}>
                  {row.premium ? '✓' : '—'}
                </span>
              </div>
            ))}

            {/* Premium CTA */}
            <div
              className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(155,93,229,0.1), rgba(255,45,120,0.05))',
                borderTop: '1px solid rgba(155,93,229,0.15)',
              }}
            >
              <div>
                <p className="text-white font-bold text-sm">FriendUs Premium</p>
                <p className="text-white/40 text-xs mt-0.5">$4.99/month · Cancel anytime</p>
              </div>
              <button
                className="px-5 py-2.5 rounded-xl font-bold text-white text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #ff2d78, #9b5de5)',
                  boxShadow: '0 4px 16px rgba(155,93,229,0.35)',
                }}
                onClick={() => window.open('https://buy.stripe.com/bJecN7efPcBWfFg4SN9oc00', '_blank', 'noopener')}
              >
                ✨ Go Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-5">✦</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Ready to find your{' '}
            <span className="gradient-text">best friend?</span>
          </h2>
          <p className="text-white/45 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
            No face. No photos. No pressure. Just real people connecting over what they actually love.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                document.querySelector('[data-cta="hero"]')?.click() ||
                document.querySelector('.btn-primary')?.click();
              }}
              className="btn-primary px-8 py-4 text-sm sm:text-base font-bold"
            >
              Find My Best Friend — Free
            </button>
            <button
              className="btn-ghost px-8 py-4 text-sm sm:text-base"
              onClick={() =>
                window.open('https://buy.stripe.com/bJecN7efPcBWfFg4SN9oc00', '_blank', 'noopener')
              }
            >
              ✨ See Premium
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}