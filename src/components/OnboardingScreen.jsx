import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isContentSafe, getBlockedReason, sanitizeText } from '../utils/contentFilter';
import { SUGGESTED_INTERESTS } from '../utils/mockData';

const STEPS = ['alias', 'likes', 'dislikes', 'interests', 'done'];

const STEP_INFO = {
  alias: {
    title: 'Choose your alias',
    subtitle: 'This is how people will know you — keep it anonymous!',
    icon: '🎭',
    color: 'from-purple-500 to-pink-500',
  },
  likes: {
    title: 'What do you love?',
    subtitle: 'Add things that spark joy — topics, activities, foods, anything!',
    icon: '💚',
    color: 'from-cyan-400 to-teal-500',
  },
  dislikes: {
    title: 'What\'s not your vibe?',
    subtitle: 'Be honest. Knowing what you dislike helps find better matches.',
    icon: '🚫',
    color: 'from-pink-500 to-rose-500',
  },
  interests: {
    title: 'Deep interests',
    subtitle: 'What are you truly passionate about? Hobbies, passions, obsessions.',
    icon: '🔮',
    color: 'from-violet-500 to-indigo-500',
  },
  done: {
    title: 'You\'re all set!',
    subtitle: 'Your vibe profile is ready. Time to find your people.',
    icon: '✨',
    color: 'from-yellow-400 to-orange-500',
  },
};

function TagInput({ tags, onAdd, onRemove, placeholder, type }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleAdd = (text) => {
    const clean = sanitizeText(text || input);
    if (!clean) return;

    const reason = getBlockedReason(clean);
    if (reason) {
      setError(reason);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (tags.length >= 15) {
      setError('Maximum 15 items allowed.');
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (tags.find(t => t.toLowerCase() === clean.toLowerCase())) {
      setError('Already added!');
      setTimeout(() => setError(''), 2000);
      return;
    }

    onAdd(clean);
    setInput('');
    setError('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  const tagClass = type === 'likes' ? 'tag-like' : type === 'dislikes' ? 'tag-dislike' : 'tag-interest';

  return (
    <div>
      <div className={`flex gap-2 mb-3 ${shake ? 'animate-bounce' : ''}`}>
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="input-field flex-1"
          maxLength={50}
        />
        <button
          onClick={() => handleAdd()}
          disabled={!input.trim()}
          className="btn-primary px-5 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          Add
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 mb-3 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span key={i} className={tagClass}>
              {tag}
              <button onClick={() => onRemove(tag)} className="ml-1 opacity-70 hover:opacity-100 text-xs">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestedChips({ onAdd, added, type }) {
  const tagClass = type === 'likes' ? 'tag-like' : type === 'dislikes' ? 'tag-dislike' : 'tag-interest';

  // Show a subset of suggestions
  const suggestions = SUGGESTED_INTERESTS.slice(0, 20);

  return (
    <div>
      <p className="text-xs text-white/40 mb-2 font-semibold uppercase tracking-wider">Quick add</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => {
          const isAdded = added.find(a => a.toLowerCase() === s.label.toLowerCase());
          return (
            <button
              key={i}
              onClick={() => !isAdded && onAdd(s.label)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
                isAdded
                  ? 'opacity-30 cursor-default'
                  : 'hover:scale-105 cursor-pointer'
              }`}
              style={{
                background: isAdded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: isAdded ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {s.emoji} {s.label}
              {isAdded && ' ✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingScreen() {
  const { setCurrentScreen, updateProfile, profile } = useApp();
  const [step, setStep] = useState(0);
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [interests, setInterests] = useState([]);

  const stepKey = STEPS[step];
  const info = STEP_INFO[stepKey];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (stepKey === 'alias') {
      const clean = sanitizeText(alias);
      if (!clean || clean.length < 3) {
        setAliasError('Alias must be at least 3 characters.');
        return;
      }
      if (!isContentSafe(clean)) {
        setAliasError('This alias is not allowed. Please choose another.');
        return;
      }
      setAliasError('');
    }

    if (stepKey === 'likes' && likes.length < 1) return;

    if (stepKey === 'done') {
      updateProfile({ alias, likes, dislikes, interests });
      setCurrentScreen('app');
      return;
    }

    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      setCurrentScreen('landing');
    } else {
      setStep(s => s - 1);
    }
  };

  const canNext = () => {
    if (stepKey === 'alias') return alias.trim().length >= 3;
    if (stepKey === 'likes') return likes.length >= 1;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-8"
        style={{ background: 'radial-gradient(ellipse, #9b5de5 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={handleBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>
            ✦
          </div>
          <span className="text-white font-bold">VibeMatch</span>
        </div>
        <div className="text-white/30 text-sm font-medium">
          {step + 1} / {STEPS.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 h-1 bg-white/5">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ff2d78, #9b5de5)',
          }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto w-full">
        {stepKey !== 'done' ? (
          <div className="w-full animate-fade-in">
            {/* Step icon */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${info.color}`}>
                {info.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{info.title}</h2>
                <p className="text-white/50 text-sm mt-0.5">{info.subtitle}</p>
              </div>
            </div>

            {/* Step content */}
            {stepKey === 'alias' && (
              <div>
                <input
                  type="text"
                  value={alias}
                  onChange={e => { setAlias(e.target.value); setAliasError(''); }}
                  placeholder="e.g. NeonDreamer, WildMosaic..."
                  className="input-field text-lg py-4"
                  maxLength={30}
                  onKeyDown={e => e.key === 'Enter' && handleNext()}
                />
                {aliasError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {aliasError}
                  </p>
                )}
                <p className="text-white/30 text-xs mt-3">
                  🔒 Your real name is never required. Stay anonymous.
                </p>
              </div>
            )}

            {stepKey === 'likes' && (
              <div>
                <TagInput
                  tags={likes}
                  onAdd={t => setLikes(prev => [...prev, t])}
                  onRemove={t => setLikes(prev => prev.filter(x => x !== t))}
                  placeholder="Type something you love (e.g. hiking, jazz, sushi)..."
                  type="likes"
                />
                <SuggestedChips
                  added={likes}
                  onAdd={t => isContentSafe(t) && setLikes(prev => prev.includes(t) ? prev : [...prev, t])}
                  type="likes"
                />
                {likes.length === 0 && (
                  <p className="text-white/30 text-xs mt-3">Add at least 1 thing you love to continue.</p>
                )}
              </div>
            )}

            {stepKey === 'dislikes' && (
              <div>
                <TagInput
                  tags={dislikes}
                  onAdd={t => setDislikes(prev => [...prev, t])}
                  onRemove={t => setDislikes(prev => prev.filter(x => x !== t))}
                  placeholder="Type something that's not your vibe..."
                  type="dislikes"
                />
                <p className="text-white/30 text-xs mt-2">Optional — but helps find better matches!</p>
              </div>
            )}

            {stepKey === 'interests' && (
              <div>
                <TagInput
                  tags={interests}
                  onAdd={t => setInterests(prev => [...prev, t])}
                  onRemove={t => setInterests(prev => prev.filter(x => x !== t))}
                  placeholder="Deep passions — philosophy, astronomy, film noir..."
                  type="interests"
                />
                <SuggestedChips
                  added={interests}
                  onAdd={t => isContentSafe(t) && setInterests(prev => prev.includes(t) ? prev : [...prev, t])}
                  type="interests"
                />
              </div>
            )}
          </div>
        ) : (
          // Done screen
          <div className="text-center animate-bounce-in">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>
              ✨
            </div>
            <h2 className="text-3xl font-black text-white mb-3">You're all set, <span className="gradient-text">{alias || 'Vibe'}</span>!</h2>
            <p className="text-white/50 mb-8">Your vibe profile is ready. Go discover your people.</p>

            {/* Profile preview */}
            <div className="glass rounded-2xl p-5 text-left mb-8">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Your Vibe Profile Preview</p>

              {likes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-white/40 mb-1.5">Loves</p>
                  <div className="flex flex-wrap gap-1.5">
                    {likes.slice(0, 5).map((l, i) => <span key={i} className="tag-like">{l}</span>)}
                    {likes.length > 5 && <span className="text-white/30 text-xs self-center">+{likes.length - 5}</span>}
                  </div>
                </div>
              )}

              {dislikes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-white/40 mb-1.5">Not my vibe</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dislikes.slice(0, 3).map((l, i) => <span key={i} className="tag-dislike">{l}</span>)}
                  </div>
                </div>
              )}

              {interests.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-1.5">Passions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.slice(0, 4).map((l, i) => <span key={i} className="tag-interest">{l}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8 w-full">
          {stepKey !== 'alias' && stepKey !== 'done' && (
            <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex-1 py-3">
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="btn-primary py-3 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            style={{ flex: 2 }}
          >
            {stepKey === 'done' ? '🚀 Enter VibeMatch' :
             stepKey === 'dislikes' || stepKey === 'interests' ? 'Continue →' :
             'Next →'}
          </button>
        </div>

        {/* Skip for optional steps */}
        {(stepKey === 'dislikes' || stepKey === 'interests') && (
          <button
            onClick={() => setStep(s => s + 1)}
            className="text-white/30 text-sm mt-3 hover:text-white/50 transition-colors"
          >
            Skip for now
          </button>
        )}
      </main>
    </div>
  );
}
