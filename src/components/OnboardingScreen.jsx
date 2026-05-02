import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { isContentSafe, getBlockedReason, sanitizeText } from '../utils/contentFilter';
import { SUGGESTED_INTERESTS } from '../utils/mockData';

const STEPS = ['alias', 'likes', 'dislikes', 'interests', 'values', 'done'];

const STEP_INFO = {
  alias: {
    title: 'Choose your alias',
    subtitle: 'This is how people will know you — keep it anonymous!',
    icon: '🎭',
    color: 'from-purple-500 to-pink-500',
  },
  likes: {
    title: 'What do you love?',
    subtitle: 'Activities, foods, places, music — anything that sparks real joy.',
    icon: '💚',
    color: 'from-cyan-400 to-teal-500',
  },
  dislikes: {
    title: "What's not your vibe?",
    subtitle: 'Being honest here helps connect you with people who actually get it.',
    icon: '🚫',
    color: 'from-pink-500 to-rose-500',
  },
  interests: {
    title: 'Your deep interests',
    subtitle: 'What could you talk about for hours? Passions, obsessions, rabbit holes.',
    icon: '🔮',
    color: 'from-violet-500 to-indigo-500',
  },
  values: {
    title: 'What do you stand for?',
    subtitle: 'The beliefs and qualities that define who you are at your core.',
    icon: '🌱',
    color: 'from-green-500 to-teal-500',
  },
  done: {
    title: "You're all set!",
    subtitle: 'Your vibe profile is ready. Time to find your people.',
    icon: '✨',
    color: 'from-yellow-400 to-orange-500',
  },
};

// Value presets — things people actually stand for
const VALUE_PRESETS = [
  { label: 'Authenticity',      emoji: '💎' },
  { label: 'Creativity',        emoji: '✨' },
  { label: 'Kindness',          emoji: '☀️' },
  { label: 'Growth mindset',    emoji: '🌱' },
  { label: 'Deep conversations',emoji: '💬' },
  { label: 'Sustainability',    emoji: '🌍' },
  { label: 'Curiosity',         emoji: '🔍' },
  { label: 'Empathy',           emoji: '💗' },
  { label: 'Loyalty',           emoji: '🤝' },
  { label: 'Freedom',           emoji: '🦅' },
  { label: 'Humor',             emoji: '😂' },
  { label: 'Slow living',       emoji: '🌿' },
  { label: 'Intentionality',    emoji: '🎯' },
  { label: 'Community',         emoji: '👥' },
  { label: 'Honesty',           emoji: '⚖️' },
  { label: 'Ambition',          emoji: '🚀' },
  { label: 'Mindfulness',       emoji: '🧘' },
  { label: 'Play & silliness',  emoji: '🎪' },
  { label: 'Social justice',    emoji: '✊' },
  { label: 'Spirituality',      emoji: '🕯️' },
];

function TagInput({ tags, onAdd, onRemove, placeholder, type }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleAdd = (text) => {
    const clean = sanitizeText(text || input);
    if (!clean) return;
    const reason = getBlockedReason(clean);
    if (reason) {
      setError(reason); setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (tags.length >= 15) { setError('Maximum 15 items.'); setTimeout(() => setError(''), 2000); return; }
    if (tags.find(t => t.toLowerCase() === clean.toLowerCase())) { setError('Already added!'); setTimeout(() => setError(''), 2000); return; }
    onAdd(clean); setInput(''); setError('');
  };

  const handleKey = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAdd(); } };
  const tagClass = type === 'likes' ? 'tag-like' : type === 'dislikes' ? 'tag-dislike' : type === 'values' ? 'tag-interest' : 'tag-interest';

  return (
    <div>
      <div className={`flex gap-2 mb-3 ${shake ? 'animate-bounce' : ''}`}>
        <input type="text" value={input} onChange={e => { setInput(e.target.value); setError(''); }}
          onKeyDown={handleKey} placeholder={placeholder} className="input-field flex-1" maxLength={50} />
        <button onClick={() => handleAdd()} disabled={!input.trim()}
          className="btn-primary px-5 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
          Add
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 mb-3 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)' }}>
          <span>⚠️</span><span>{error}</span>
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span key={i} className={tagClass}>
              {tag}
              <button onClick={() => onRemove(tag)} className="ml-1 opacity-70 hover:opacity-100 text-xs">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Category-grouped suggestion chips
function SuggestedChips({ onAdd, added, type, filterCategory }) {
  const tagClass = type === 'likes' ? 'tag-like' : type === 'dislikes' ? 'tag-dislike' : 'tag-interest';
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(SUGGESTED_INTERESTS.map(s => s.category))];
    return cats;
  }, []);

  const shown = useMemo(() => {
    const pool = activeCategory === 'All'
      ? SUGGESTED_INTERESTS
      : SUGGESTED_INTERESTS.filter(s => s.category === activeCategory);
    return pool.slice(0, activeCategory === 'All' ? 24 : 30);
  }, [activeCategory]);

  return (
    <div>
      {/* Category filter row */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeCategory === cat ? 'linear-gradient(135deg, #ff2d78, #9b5de5)' : 'rgba(255,255,255,0.06)',
              color: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.45)',
              border: '1px solid ' + (activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)'),
            }}>
            {cat}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {shown.map((s, i) => {
          const isAdded = added.find(a => a.toLowerCase() === s.label.toLowerCase());
          return (
            <button key={i} onClick={() => !isAdded && onAdd(s.label)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${isAdded ? 'opacity-30 cursor-default' : 'hover:scale-105 cursor-pointer'}`}
              style={{
                background: isAdded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: isAdded ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
              }}>
              {s.emoji} {s.label}{isAdded && ' ✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ValueChips({ onAdd, added }) {
  return (
    <div>
      <p className="text-xs text-white/40 mb-2 font-semibold uppercase tracking-wider">Quick add</p>
      <div className="flex flex-wrap gap-2">
        {VALUE_PRESETS.map((v, i) => {
          const isAdded = added.find(a => a.toLowerCase() === v.label.toLowerCase());
          return (
            <button key={i} onClick={() => !isAdded && onAdd(v.label)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${isAdded ? 'opacity-30 cursor-default' : 'hover:scale-105 cursor-pointer'}`}
              style={{
                background: isAdded ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
                border: `1px solid ${isAdded ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.15)'}`,
                color: isAdded ? 'rgba(74,222,128,0.5)' : 'rgba(74,222,128,0.8)',
              }}>
              {v.emoji} {v.label}{isAdded && ' ✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingScreen() {
  const { setCurrentScreen, updateProfile } = useApp();
  const [step, setStep] = useState(0);
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [interests, setInterests] = useState([]);
  const [values, setValues] = useState([]);

  const stepKey = STEPS[step];
  const info = STEP_INFO[stepKey];
  const progress = (step / (STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (stepKey === 'alias') {
      const clean = sanitizeText(alias);
      if (!clean || clean.length < 3) { setAliasError('Alias must be at least 3 characters.'); return; }
      if (!isContentSafe(clean)) { setAliasError('This alias is not allowed. Please choose another.'); return; }
      setAliasError('');
    }
    if (stepKey === 'likes' && likes.length < 1) return;
    if (stepKey === 'done') {
      updateProfile({ alias, likes, dislikes, interests, values });
      setCurrentScreen('app');
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) setCurrentScreen('landing');
    else setStep(s => s - 1);
  };

  const canNext = () => {
    if (stepKey === 'alias') return alias.trim().length >= 3;
    if (stepKey === 'likes') return likes.length >= 1;
    return true;
  };

  const safeAdd = (setter) => (t) => {
    if (isContentSafe(t)) setter(prev => prev.includes(t) ? prev : [...prev, t]);
  };

  return (
    <div className="bg-[#0a0a0f] flex flex-col relative overflow-hidden" style={{ minHeight: '100dvh' }}>
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 sm:w-[600px] h-72 sm:h-[600px] rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #9b5de5 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-white/5 flex-shrink-0">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm">← Back</button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>✦</div>
          <span className="text-white font-bold text-sm">VibeMatch</span>
        </div>
        <div className="text-white/30 text-xs sm:text-sm font-medium">{step + 1} / {STEPS.length}</div>
      </header>

      {/* Progress */}
      <div className="relative z-10 h-1 bg-white/5 flex-shrink-0">
        <div className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #ff2d78, #9b5de5)' }} />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col items-center justify-start sm:justify-center min-h-full px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto w-full">

          {stepKey !== 'done' ? (
            <div className="w-full animate-fade-in">
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl bg-gradient-to-br ${info.color} flex-shrink-0`}>
                  {info.icon}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{info.title}</h2>
                  <p className="text-white/50 text-xs sm:text-sm mt-0.5">{info.subtitle}</p>
                </div>
              </div>

              {stepKey === 'alias' && (
                <div>
                  <input type="text" value={alias} onChange={e => { setAlias(e.target.value); setAliasError(''); }}
                    placeholder="e.g. NeonDreamer, WildMosaic..." className="input-field text-lg py-4"
                    maxLength={30} onKeyDown={e => e.key === 'Enter' && handleNext()} />
                  {aliasError && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><span>⚠️</span> {aliasError}</p>}
                  <p className="text-white/30 text-xs mt-3">🔒 Your real name is never required. Stay anonymous.</p>
                </div>
              )}

              {stepKey === 'likes' && (
                <div>
                  <TagInput tags={likes} onAdd={t => setLikes(prev => [...prev, t])}
                    onRemove={t => setLikes(prev => prev.filter(x => x !== t))}
                    placeholder="e.g. hiking, jazz, street photography..." type="likes" />
                  <SuggestedChips added={likes} onAdd={safeAdd(setLikes)} type="likes" />
                  {likes.length === 0 && <p className="text-white/30 text-xs mt-3">Add at least 1 thing you love to continue.</p>}
                </div>
              )}

              {stepKey === 'dislikes' && (
                <div>
                  <TagInput tags={dislikes} onAdd={t => setDislikes(prev => [...prev, t])}
                    onRemove={t => setDislikes(prev => prev.filter(x => x !== t))}
                    placeholder="e.g. small talk, loud restaurants, clickbait..." type="dislikes" />
                  <SuggestedChips added={dislikes} onAdd={safeAdd(setDislikes)} type="dislikes" />
                  <p className="text-white/30 text-xs mt-2">Optional — but helps find better friends!</p>
                </div>
              )}

              {stepKey === 'interests' && (
                <div>
                  <TagInput tags={interests} onAdd={t => setInterests(prev => [...prev, t])}
                    onRemove={t => setInterests(prev => prev.filter(x => x !== t))}
                    placeholder="e.g. philosophy, astronomy, film noir, fermentation..." type="interests" />
                  <SuggestedChips added={interests} onAdd={safeAdd(setInterests)} type="interests" />
                </div>
              )}

              {stepKey === 'values' && (
                <div>
                  <TagInput tags={values} onAdd={t => setValues(prev => [...prev, t])}
                    onRemove={t => setValues(prev => prev.filter(x => x !== t))}
                    placeholder="e.g. authenticity, slow living, radical kindness..." type="values" />
                  <ValueChips added={values} onAdd={safeAdd(setValues)} />
                  <p className="text-white/30 text-xs mt-3">Optional — but it's the deepest signal of compatibility.</p>
                </div>
              )}
            </div>

          ) : (
            // Done screen
            <div className="text-center animate-bounce-in">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl"
                style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>✨</div>
              <h2 className="text-3xl font-black text-white mb-3">You're all set, <span className="gradient-text">{alias || 'Vibe'}</span>!</h2>
              <p className="text-white/50 mb-8">Your vibe profile is ready. Go discover your people.</p>

              <div className="glass rounded-2xl p-5 text-left mb-8 space-y-3">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Your Profile Preview</p>
                {likes.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 mb-1.5">💚 Loves</p>
                    <div className="flex flex-wrap gap-1.5">
                      {likes.slice(0, 5).map((l, i) => <span key={i} className="tag-like">{l}</span>)}
                      {likes.length > 5 && <span className="text-white/30 text-xs self-center">+{likes.length - 5}</span>}
                    </div>
                  </div>
                )}
                {dislikes.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 mb-1.5">🚫 Not my vibe</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dislikes.slice(0, 3).map((l, i) => <span key={i} className="tag-dislike">{l}</span>)}
                    </div>
                  </div>
                )}
                {interests.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 mb-1.5">🔮 Passions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.slice(0, 4).map((l, i) => <span key={i} className="tag-interest">{l}</span>)}
                    </div>
                  </div>
                )}
                {values.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40 mb-1.5">🌱 Values</p>
                    <div className="flex flex-wrap gap-1.5">
                      {values.slice(0, 4).map((v, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-6 sm:mt-8 w-full">
            {stepKey !== 'alias' && stepKey !== 'done' && (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex-1 py-3 text-sm">← Back</button>
            )}
            <button onClick={handleNext} disabled={!canNext()}
              className="btn-primary py-3 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              style={{ flex: 2 }}>
              {stepKey === 'done' ? '🚀 Enter VibeMatch' : stepKey === 'dislikes' || stepKey === 'interests' || stepKey === 'values' ? 'Continue →' : 'Next →'}
            </button>
          </div>

          {(stepKey === 'dislikes' || stepKey === 'interests' || stepKey === 'values') && (
            <button onClick={() => setStep(s => s + 1)}
              className="text-white/30 text-sm mt-3 hover:text-white/50 transition-colors pb-safe">
              Skip for now
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
