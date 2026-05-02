import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VISION_SEARCH_ITEMS } from '../../utils/mockData';
import { isContentSafe, getBlockedReason } from '../../utils/contentFilter';

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

const CATEGORIES = ['All', 'Places', 'Food', 'Activities', 'Music', 'Tech', 'Animals', 'Vibes'];

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
  return (
    <button
      onClick={() => isAdded ? onRemove(item.label) : onAdd(item)}
      className="flex items-center gap-3 p-3 rounded-xl transition-all group"
      style={{
        background: isAdded ? 'rgba(155,93,229,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isAdded ? 'rgba(155,93,229,0.35)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${item.color} flex-shrink-0`}>
        {item.emoji}
      </div>
      <div className="text-left flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{item.label}</p>
        <p className="text-white/40 text-xs">{item.category}</p>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${isAdded ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/40 group-hover:bg-white/20'}`}>
        {isAdded ? '✓' : '+'}
      </div>
    </button>
  );
}

function VisionTile({ item, onRemove, index, isReadonly, isRedFlag }) {
  const [hovered, setHovered] = useState(false);

  const sizes = [
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
  ];
  const sizeClass = isRedFlag ? 'col-span-1 row-span-1' : sizes[index % sizes.length];

  return (
    <div
      className={`vision-tile ${sizeClass}`}
      style={{ minHeight: isRedFlag ? '80px' : '100px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
      {isRedFlag && (
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 4px, transparent 4px, transparent 8px)' }} />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        <span className="text-2xl mb-1" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}>
          {item.emoji}
        </span>
        <span className="text-white font-bold text-center leading-tight"
          style={{ fontSize: '10px', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
          {item.label}
        </span>
      </div>
      {!isReadonly && (
        <div className="tile-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(item.label); }}
            className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center text-sm hover:bg-red-500/80 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      {isReadonly && (
        <div className="absolute top-1.5 right-1.5">
          <span className="text-xs">✨</span>
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
    addToRedFlagBoard, removeFromRedFlagBoard,
  } = useApp();

  const [activeBoard, setActiveBoard] = useState('vibe');
  const [showPanel, setShowPanel] = useState(false);

  const boardConfig = {
    vibe: { items: profile.vibeBoard, add: addToVibeBoard, remove: removeFromVibeBoard },
    discovery: { items: profile.discoveryBoard, add: addToDiscoveryBoard, remove: removeFromDiscoveryBoard },
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
                        : 'rgba(155,93,229,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive
                    ? tab.id === 'redflag' ? 'rgba(255,45,120,0.35)'
                      : tab.id === 'discovery' ? 'rgba(0,245,212,0.25)'
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
                        ? tab.id === 'redflag' ? 'rgba(255,45,120,0.3)' : 'rgba(255,255,255,0.15)'
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
          {activeBoard === 'redflag' && '🚩 Your personal dealbreaker tracker. Private to you.'}
        </p>
      </div>

      {/* Add panel */}
      {showPanel && !currentTab.readonly && (
        activeBoard === 'redflag'
          ? <RedFlagPanel items={items} onAdd={add} onRemove={remove} />
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
                    : 'linear-gradient(135deg, #ff2d78, #9b5de5)',
                }}>
                + Start Adding
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={`grid gap-2 ${activeBoard === 'redflag' ? 'grid-cols-2' : 'grid-cols-3'}`}
              style={{ gridAutoRows: activeBoard === 'redflag' ? '80px' : '100px' }}
            >
              {items.map((item, i) => (
                <VisionTile
                  key={item.label}
                  item={item}
                  index={i}
                  onRemove={remove}
                  isReadonly={currentTab.readonly}
                  isRedFlag={activeBoard === 'redflag'}
                />
              ))}

              {/* Add more tile */}
              {!currentTab.readonly && (
                <button
                  onClick={() => setShowPanel(true)}
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
                  style={{
                    minHeight: activeBoard === 'redflag' ? '80px' : '100px',
                    borderColor: activeBoard === 'redflag' ? 'rgba(255,45,120,0.2)' : 'rgba(255,255,255,0.08)',
                    color: activeBoard === 'redflag' ? 'rgba(255,45,120,0.4)' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  <span className="text-xl">{activeBoard === 'redflag' ? '🚩' : '+'}</span>
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
