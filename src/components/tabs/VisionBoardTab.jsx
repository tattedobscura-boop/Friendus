import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VISION_SEARCH_ITEMS } from '../../utils/mockData';
import { isContentSafe, getBlockedReason } from '../../utils/contentFilter';

// Green flag presets
const GREEN_FLAG_PRESETS = [
  { emoji: '💚', label: 'Great listener', color: 'from-green-500 to-emerald-600' },
  { emoji: '💚', label: 'Respects boundaries', color: 'from-emerald-500 to-green-600' },
  { emoji: '💚', label: 'Shows up consistently', color: 'from-green-600 to-teal-600' },
  { emoji: '💚', label: 'Honest & open', color: 'from-teal-500 to-green-600' },
  { emoji: '💚', label: 'Emotionally available', color: 'from-green-500 to-emerald-700' },
  { emoji: '💚', label: 'Checks in on you', color: 'from-emerald-600 to-green-700' },
  { emoji: '💚', label: 'Non-judgmental', color: 'from-green-500 to-lime-600' },
  { emoji: '💚', label: 'Keeps their word', color: 'from-lime-500 to-green-600' },
  { emoji: '💚', label: 'Celebrates your wins', color: 'from-green-400 to-emerald-600' },
  { emoji: '💚', label: 'Gives you space', color: 'from-teal-400 to-green-600' },
  { emoji: '💚', label: 'Takes accountability', color: 'from-emerald-500 to-teal-600' },
  { emoji: '💚', label: 'Makes you laugh', color: 'from-green-400 to-lime-500' },
  { emoji: '💚', label: 'Genuinely curious', color: 'from-lime-400 to-green-500' },
  { emoji: '💚', label: 'Supportive', color: 'from-green-500 to-emerald-600' },
  { emoji: '💚', label: 'Reciprocates effort', color: 'from-emerald-400 to-green-600' },
  { emoji: '💚', label: 'Calm communicator', color: 'from-teal-500 to-emerald-600' },
  { emoji: '💚', label: 'Remembers details', color: 'from-green-600 to-teal-700' },
  { emoji: '💚', label: 'Growth mindset', color: 'from-lime-500 to-green-700' },
  { emoji: '💚', label: 'Comfortable silence', color: 'from-green-500 to-teal-600' },
  { emoji: '💚', label: 'Uplifts others', color: 'from-emerald-500 to-lime-600' },
];

// Red flag presets
const RED_FLAG_PRESETS = [
  { emoji: '🚩', label: 'Cancels plans', color: 'from-red-600 to-rose-700' },
  { emoji: '🚩', label: 'Love bombing', color: 'from-red-500 to-pink-600' },
  { emoji: '🚩', label: 'Bad listener', color: 'from-rose-600 to-red-700' },
  { emoji: '🚩', label: 'Inconsistent', color: 'from-red-600 to-orange-700' },
  { emoji: '🚩', label: 'Dismissive', color: 'from-red-700 to-rose-800' },
  { emoji: '🚩', label: 'Overly jealous', color: 'from-orange-600 to-red-700' },
  { emoji: '🚩', label: 'Disrespectful', color: 'from-red-600 to-rose-700' },
  { emoji: '🚩', label: 'No boundaries', color: 'from-rose-600 to-red-700' },
  { emoji: '🚩', label: 'Two-faced', color: 'from-red-600 to-orange-700' },
  { emoji: '🚩', label: 'Never on time', color: 'from-orange-600 to-red-600' },
  { emoji: '🚩', label: 'Stonewalling', color: 'from-red-700 to-rose-800' },
  { emoji: '🚩', label: 'Guilt tripping', color: 'from-rose-700 to-red-800' },
  { emoji: '🚩', label: 'Talks over people', color: 'from-red-600 to-orange-700' },
  { emoji: '🚩', label: 'Hot and cold', color: 'from-orange-500 to-red-600' },
  { emoji: '🚩', label: 'Criticizes constantly', color: 'from-red-600 to-rose-700' },
  { emoji: '🚩', label: 'No accountability', color: 'from-red-700 to-orange-700' },
  { emoji: '🚩', label: 'Negative energy', color: 'from-rose-600 to-red-700' },
  { emoji: '🚩', label: 'One-sided effort', color: 'from-red-600 to-pink-700' },
  { emoji: '🚩', label: 'Ghosting', color: 'from-slate-600 to-red-700' },
  { emoji: '🚩', label: 'Controlling', color: 'from-red-700 to-rose-800' },
];

const CATEGORIES = ['All', 'Places', 'Food', 'Activities', 'Music', 'Tech', 'Animals', 'Ideas', 'Wellness', 'Film', 'Vibes'];

// Board types config
const BOARD_TABS = [
  {
    id: 'vibe',
    label: 'Vibe Board',
    icon: '🎨',
    desc: 'Your visual identity',
    color: 'from-purple-500 to-pink-500',
    emptyIcon: '🎨',
    emptyText: 'Build your vibe board — things that represent you without showing your face.',
  },
  {
    id: 'discovery',
    label: 'Discoveries',
    icon: '✨',
    desc: 'From chat answers',
    color: 'from-cyan-400 to-teal-500',
    emptyIcon: '✨',
    emptyText: 'Answer chat prompts and your discoveries auto-populate here.',
    readonly: true,
  },
  {
    id: 'greenflag',
    label: 'Green Flags',
    icon: '💚',
    desc: 'Your must-haves',
    color: 'from-green-500 to-emerald-600',
    emptyIcon: '💚',
    emptyText: 'Log the qualities that matter most to you in a friendship. Your green lights.',
  },
  {
    id: 'redflag',
    label: 'Red Flags',
    icon: '🚩',
    desc: 'Your dealbreakers',
    color: 'from-red-500 to-rose-600',
    emptyIcon: '🚩',
    emptyText: "Track patterns that aren't okay with you. Your dealbreakers, logged.",
  },
];

function SearchResultItem({ item, isAdded, onAdd, onRemove }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => isAdded ? onRemove(item.label) : onAdd(item)}
      className="flex items-center gap-3 p-2.5 rounded-xl transition-all group text-left"
      style={{
        background: isAdded ? 'rgba(155,93,229,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isAdded ? 'rgba(155,93,229,0.35)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {/* Photo thumbnail */}
      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
        {item.img && !imgError ? (
          <img
            src={item.img}
            alt={item.label}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center text-xl`}>
            {item.emoji}
          </div>
        )}
        {/* Emoji badge */}
        <div className="absolute bottom-0 right-0 w-5 h-5 flex items-center justify-center rounded-tl-lg"
          style={{ background: 'rgba(0,0,0,0.55)', fontSize: '11px' }}>
          {item.emoji}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate leading-tight">{item.label}</p>
        <p className="text-white/35 text-xs mt-0.5">{item.category}</p>
      </div>

      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${isAdded ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/40 group-hover:bg-white/20'}`}>
        {isAdded ? '✓' : '+'}
      </div>
    </button>
  );
}

// Mosaic size pattern — first tile wide, fourth tile tall, rest square
const TILE_SIZES = [
  'col-span-2 row-span-1',  // 0 – wide
  'col-span-1 row-span-1',  // 1
  'col-span-1 row-span-1',  // 2
  'col-span-1 row-span-2',  // 3 – tall
  'col-span-1 row-span-1',  // 4
  'col-span-1 row-span-1',  // 5
  'col-span-1 row-span-1',  // 6
  'col-span-2 row-span-1',  // 7 – wide
];

function VisionTile({ item, onRemove, index, isReadonly, isRedFlag, isGreenFlag }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFlagTile = isRedFlag || isGreenFlag;
  const sizeClass = isFlagTile
    ? 'col-span-1 row-span-1'
    : TILE_SIZES[index % TILE_SIZES.length];

  const minH = isFlagTile ? '80px' : '110px';

  return (
    <div
      className={`vision-tile ${sizeClass} group`}
      style={{ minHeight: minH }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Gradient fallback always behind ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />

      {/* ── Real photo ── */}
      {item.img && !isFlagTile && !imgError && (
        <img
          src={item.img}
          alt={item.label}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* ── Red flag hatch overlay ── */}
      {isRedFlag && (
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(0,0,0,0.15) 0,rgba(0,0,0,0.15) 4px,transparent 4px,transparent 10px)' }} />
      )}

      {/* ── Green flag shimmer overlay ── */}
      {isGreenFlag && (
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0,rgba(255,255,255,0.12) 3px,transparent 3px,transparent 12px)' }} />
      )}

      {/* ── Dark gradient scrim so label is always readable ── */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />

      {/* ── Label ── */}
      <div className="absolute bottom-0 left-0 right-0 p-2 flex items-end gap-1.5">
        <span className="text-base leading-none flex-shrink-0"
          style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }}>
          {item.emoji}
        </span>
        <span className="text-white font-bold leading-tight"
          style={{ fontSize: '11px', textShadow: '0 1px 4px rgba(0,0,0,0.9)', letterSpacing: '0.01em' }}>
          {item.label}
        </span>
      </div>

      {/* ── Discovery badge ── */}
      {isReadonly && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
          style={{ background: 'rgba(0,245,212,0.8)', backdropFilter: 'blur(4px)' }}>
          ✨
        </div>
      )}

      {/* ── Remove overlay ── */}
      {!isReadonly && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl transition-opacity duration-150"
          style={{ background: 'rgba(0,0,0,0.45)', opacity: hovered ? 1 : 0, backdropFilter: 'blur(2px)' }}
        >
          <button
            onClick={e => { e.stopPropagation(); onRemove(item.label); }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,45,120,0.85)', boxShadow: '0 2px 12px rgba(255,45,120,0.5)' }}
          >×</button>
        </div>
      )}
    </div>
  );
}

function RedFlagPresetPicker({ onAdd, added }) {
  return (
    <div>
      <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Common Red Flags</p>
      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
        {RED_FLAG_PRESETS.map((rf, i) => {
          const isAdded = added.find(a => a.label === rf.label);
          return (
            <button
              key={i}
              onClick={() => !isAdded && onAdd(rf)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all"
              style={{
                background: isAdded ? 'rgba(255,45,120,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isAdded ? 'rgba(255,45,120,0.3)' : 'rgba(255,255,255,0.08)'}`,
                opacity: isAdded ? 0.5 : 1,
                cursor: isAdded ? 'default' : 'pointer',
              }}
            >
              <span className="text-sm flex-shrink-0">🚩</span>
              <span className="text-xs text-white/80 font-medium leading-tight">{rf.label}</span>
              {isAdded && <span className="ml-auto text-xs text-red-400 flex-shrink-0">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GreenFlagPresetPicker({ onAdd, added }) {
  return (
    <div>
      <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Common Green Flags</p>
      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
        {GREEN_FLAG_PRESETS.map((gf, i) => {
          const isAdded = added.find(a => a.label === gf.label);
          return (
            <button
              key={i}
              onClick={() => !isAdded && onAdd(gf)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all"
              style={{
                background: isAdded ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isAdded ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                opacity: isAdded ? 0.5 : 1,
                cursor: isAdded ? 'default' : 'pointer',
              }}
            >
              <span className="text-sm flex-shrink-0">💚</span>
              <span className="text-xs text-white/80 font-medium leading-tight">{gf.label}</span>
              {isAdded && <span className="ml-auto text-xs text-green-400 flex-shrink-0">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GreenFlagPanel({ items, onAdd, onRemove }) {
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');

  const handleCustom = () => {
    const clean = customInput.trim();
    if (!clean) return;
    const reason = getBlockedReason(clean);
    if (reason) { setCustomError(reason); setTimeout(() => setCustomError(''), 3000); return; }
    onAdd({ emoji: '💚', label: clean, color: 'from-green-500 to-emerald-600', category: 'Custom' });
    setCustomInput('');
  };

  return (
    <div className="p-4 space-y-4 border-b border-white/5 animate-slide-up"
      style={{ background: 'rgba(34,197,94,0.03)' }}>
      <div>
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Add your own</p>
        <div className="flex gap-2">
          <input type="text" value={customInput} onChange={e => { setCustomInput(e.target.value); setCustomError(''); }}
            placeholder="e.g. Remembers what matters to you..."
            className="input-field flex-1 text-sm py-2" maxLength={40}
            onKeyDown={e => e.key === 'Enter' && handleCustom()} />
          <button onClick={handleCustom} disabled={!customInput.trim()} className="btn-primary px-4 text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
            💚
          </button>
        </div>
        {customError && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><span>⚠️</span>{customError}</p>}
      </div>
      <GreenFlagPresetPicker onAdd={onAdd} added={items} />
    </div>
  );
}

function VibeSearchPanel({ items, onAdd, onRemove, onAddCustom }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');

  const filtered = useMemo(() => {
    return VISION_SEARCH_ITEMS.filter(item => {
      const matchSearch = !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, activeCategory]);

  const handleCustom = () => {
    const clean = customInput.trim();
    if (!clean) return;
    const reason = getBlockedReason(clean);
    if (reason) { setCustomError(reason); setTimeout(() => setCustomError(''), 3000); return; }
    onAddCustom({ emoji: '⭐', label: clean, color: 'from-yellow-400 to-orange-500', category: 'Custom' });
    setCustomInput('');
  };

  return (
    <div className="p-4 space-y-3 border-b border-white/5 animate-slide-up"
      style={{ background: 'rgba(155,93,229,0.03)' }}>
      <div>
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Add custom</p>
        <div className="flex gap-2">
          <input type="text" value={customInput} onChange={e => { setCustomInput(e.target.value); setCustomError(''); }}
            placeholder="e.g. Vintage cameras, Rooftop gardens..."
            className="input-field flex-1 text-sm py-2" maxLength={40}
            onKeyDown={e => e.key === 'Enter' && handleCustom()} />
          <button onClick={handleCustom} disabled={!customInput.trim()} className="btn-primary px-4 text-sm disabled:opacity-40">+</button>
        </div>
        {customError && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><span>⚠️</span>{customError}</p>}
      </div>

      <div>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search activities, places, foods..." className="input-field text-sm mb-2" />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: activeCategory === cat ? 'linear-gradient(135deg, #ff2d78, #9b5de5)' : 'rgba(255,255,255,0.07)',
                color: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.5)',
                border: '1px solid ' + (activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)'),
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
        {filtered.map((item, i) => (
          <SearchResultItem key={i} item={item}
            isAdded={!!items.find(b => b.label === item.label)}
            onAdd={onAdd} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

function RedFlagPanel({ items, onAdd, onRemove }) {
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');

  const handleCustom = () => {
    const clean = customInput.trim();
    if (!clean) return;
    const reason = getBlockedReason(clean);
    if (reason) { setCustomError(reason); setTimeout(() => setCustomError(''), 3000); return; }
    onAdd({ emoji: '🚩', label: clean, color: 'from-red-600 to-rose-700', category: 'Custom' });
    setCustomInput('');
  };

  return (
    <div className="p-4 space-y-4 border-b border-white/5 animate-slide-up"
      style={{ background: 'rgba(255,45,120,0.02)' }}>
      <div>
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Add your own</p>
        <div className="flex gap-2">
          <input type="text" value={customInput} onChange={e => { setCustomInput(e.target.value); setCustomError(''); }}
            placeholder="e.g. Talks about ex constantly..."
            className="input-field flex-1 text-sm py-2" maxLength={40}
            onKeyDown={e => e.key === 'Enter' && handleCustom()} />
          <button onClick={handleCustom} disabled={!customInput.trim()} className="btn-primary px-4 text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #c026d3)' }}>
            🚩
          </button>
        </div>
        {customError && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><span>⚠️</span>{customError}</p>}
      </div>
      <RedFlagPresetPicker onAdd={onAdd} added={items} />
    </div>
  );
}

export default function VisionBoardTab() {
  const {
    profile,
    addToVibeBoard, removeFromVibeBoard,
    addToDiscoveryBoard, removeFromDiscoveryBoard,
    addToGreenFlagBoard, removeFromGreenFlagBoard,
    addToRedFlagBoard, removeFromRedFlagBoard,
  } = useApp();

  const [activeBoard, setActiveBoard] = useState('vibe');
  const [showPanel, setShowPanel] = useState(false);

  const boardConfig = {
    vibe: { items: profile.vibeBoard, add: addToVibeBoard, remove: removeFromVibeBoard },
    discovery: { items: profile.discoveryBoard, add: addToDiscoveryBoard, remove: removeFromDiscoveryBoard },
    greenflag: { items: profile.greenFlagBoard, add: addToGreenFlagBoard, remove: removeFromGreenFlagBoard },
    redflag: { items: profile.redFlagBoard, add: addToRedFlagBoard, remove: removeFromRedFlagBoard },
  };

  const currentTab = BOARD_TABS.find(t => t.id === activeBoard);
  const { items, add, remove } = boardConfig[activeBoard];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-black text-white">Boards</h2>
          {!currentTab.readonly && (
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              style={{
                background: activeBoard === 'redflag'
                  ? 'linear-gradient(135deg, #ff2d78, #c026d3)'
                  : activeBoard === 'greenflag'
                    ? 'linear-gradient(135deg, #22c55e, #10b981)'
                    : 'linear-gradient(135deg, #ff2d78, #9b5de5)',
              }}
            >
              {showPanel ? '× Close' : `+ Add to ${currentTab.label}`}
            </button>
          )}
        </div>

        {/* Board type tabs */}
        <div className="flex gap-2">
          {BOARD_TABS.map(tab => {
            const count = boardConfig[tab.id].items.length;
            const isActive = activeBoard === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveBoard(tab.id); setShowPanel(false); }}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl transition-all"
                style={{
                  background: isActive
                    ? tab.id === 'redflag'
                      ? 'rgba(255,45,120,0.15)'
                      : tab.id === 'discovery'
                        ? 'rgba(0,245,212,0.1)'
                        : tab.id === 'greenflag'
                          ? 'rgba(34,197,94,0.12)'
                          : 'rgba(155,93,229,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive
                    ? tab.id === 'redflag' ? 'rgba(255,45,120,0.35)'
                      : tab.id === 'discovery' ? 'rgba(0,245,212,0.25)'
                        : tab.id === 'greenflag' ? 'rgba(34,197,94,0.35)'
                          : 'rgba(155,93,229,0.35)'
                    : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="text-xs font-bold" style={{
                  color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                  fontSize: '10px',
                }}>
                  {tab.label}
                </span>
                {count > 0 && (
                  <span className="text-xs font-bold rounded-full px-1.5 py-0.5"
                    style={{
                      background: isActive
                        ? tab.id === 'redflag' ? 'rgba(255,45,120,0.3)'
                          : tab.id === 'greenflag' ? 'rgba(34,197,94,0.3)'
                            : 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.07)',
                      color: isActive ? 'white' : 'rgba(255,255,255,0.3)',
                      fontSize: '9px',
                    }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Board description */}
      <div className="px-5 py-2 border-b border-white/5">
        <p className="text-xs text-white/35 flex items-center gap-1.5">
          <span>{currentTab.icon}</span>
          {activeBoard === 'vibe' && 'Your visual identity. No faces — just vibes.'}
          {activeBoard === 'discovery' && '✨ Auto-populated from your chat prompt answers.'}
          {activeBoard === 'greenflag' && '💚 The qualities that make someone a real one. Private to you.'}
          {activeBoard === 'redflag' && '🚩 Your personal dealbreaker tracker. Private to you.'}
        </p>
      </div>

      {/* Add panel */}
      {showPanel && !currentTab.readonly && (
        activeBoard === 'redflag'
          ? <RedFlagPanel items={items} onAdd={add} onRemove={remove} />
          : activeBoard === 'greenflag'
            ? <GreenFlagPanel items={items} onAdd={add} onRemove={remove} />
            : <VibeSearchPanel items={items} onAdd={add} onRemove={remove} onAddCustom={add} />
      )}

      {/* Board grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-48 text-center py-8">
            <div className="text-5xl mb-3 opacity-30">{currentTab.emptyIcon}</div>
            <p className="text-white/40 font-semibold mb-1">
              {currentTab.label} is empty
            </p>
            <p className="text-white/25 text-sm mb-5 max-w-xs">{currentTab.emptyText}</p>
            {!currentTab.readonly && (
              <button onClick={() => setShowPanel(true)}
                className="btn-primary px-5 py-2.5 text-sm"
                style={{
                  background: activeBoard === 'redflag'
                    ? 'linear-gradient(135deg, #ff2d78, #c026d3)'
                    : activeBoard === 'greenflag'
                      ? 'linear-gradient(135deg, #22c55e, #10b981)'
                      : 'linear-gradient(135deg, #ff2d78, #9b5de5)',
                }}>
                + Start Adding
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={`grid gap-2 ${(activeBoard === 'redflag' || activeBoard === 'greenflag') ? 'grid-cols-2' : 'grid-cols-3'}`}
              style={{ gridAutoRows: (activeBoard === 'redflag' || activeBoard === 'greenflag') ? '80px' : '100px' }}
            >
              {items.map((item, i) => (
                <VisionTile
                  key={item.label}
                  item={item}
                  index={i}
                  onRemove={remove}
                  isReadonly={currentTab.readonly}
                  isRedFlag={activeBoard === 'redflag'}
                  isGreenFlag={activeBoard === 'greenflag'}
                />
              ))}

              {/* Add more tile */}
              {!currentTab.readonly && (
                <button
                  onClick={() => setShowPanel(true)}
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
                  style={{
                    minHeight: (activeBoard === 'redflag' || activeBoard === 'greenflag') ? '80px' : '100px',
                    borderColor: activeBoard === 'redflag' ? 'rgba(255,45,120,0.2)'
                      : activeBoard === 'greenflag' ? 'rgba(34,197,94,0.25)'
                        : 'rgba(255,255,255,0.08)',
                    color: activeBoard === 'redflag' ? 'rgba(255,45,120,0.4)'
                      : activeBoard === 'greenflag' ? 'rgba(34,197,94,0.5)'
                        : 'rgba(255,255,255,0.25)',
                  }}
                >
                  <span className="text-xl">{activeBoard === 'redflag' ? '🚩' : activeBoard === 'greenflag' ? '💚' : '+'}</span>
                  <span className="text-xs font-semibold">Add</span>
                </button>
              )}
            </div>

            {/* Discovery board note */}
            {activeBoard === 'discovery' && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-xs"
                style={{ background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.15)', color: 'rgba(0,245,212,0.7)' }}>
                <span>✨</span>
                <span>These are auto-discovered from answering chat prompts — a window into who you are through conversations.</span>
              </div>
            )}

            {/* Green flag board note */}
            {activeBoard === 'greenflag' && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-xs"
                style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', color: 'rgba(74,222,128,0.8)' }}>
                <span>🔒</span>
                <span>This board is private. Know your worth — log what a real connection looks like to you.</span>
              </div>
            )}

            {/* Red flag board note */}
            {activeBoard === 'redflag' && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-xs"
                style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.15)', color: 'rgba(255,45,120,0.7)' }}>
                <span>🔒</span>
                <span>This board is private. Use it to track patterns and protect your peace.</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
