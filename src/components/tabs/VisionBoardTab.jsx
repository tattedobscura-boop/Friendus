import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VISION_SEARCH_ITEMS } from '../../utils/mockData';
import { isContentSafe, getBlockedReason } from '../../utils/contentFilter';

const CATEGORIES = ['All', 'Places', 'Food', 'Activities', 'Music', 'Tech', 'Animals', 'Vibes'];

function SearchResultItem({ item, isAdded, onAdd, onRemove }) {
  return (
    <button
      onClick={() => isAdded ? onRemove(item.label) : onAdd(item)}
      className="flex items-center gap-3 p-3 rounded-xl transition-all group"
      style={{
        background: isAdded ? 'rgba(155, 93, 229, 0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isAdded ? 'rgba(155, 93, 229, 0.4)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${item.color} flex-shrink-0`}>
        {item.emoji}
      </div>
      <div className="text-left flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{item.label}</p>
        <p className="text-white/40 text-xs">{item.category}</p>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
        isAdded
          ? 'bg-purple-500 text-white'
          : 'bg-white/10 text-white/40 group-hover:bg-white/20'
      }`}>
        {isAdded ? '✓' : '+'}
      </div>
    </button>
  );
}

function VisionTile({ item, onRemove, index }) {
  const [hovered, setHovered] = useState(false);

  const sizes = [
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
  ];

  const sizeClass = sizes[index % sizes.length];

  return (
    <div
      className={`vision-tile ${sizeClass}`}
      style={{ minHeight: '100px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
        <span className="text-3xl mb-1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
          {item.emoji}
        </span>
        <span className="text-white font-bold text-xs text-center leading-tight"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {item.label}
        </span>
      </div>
      <div className="tile-overlay" style={{ opacity: hovered ? 1 : 0 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item.label); }}
          className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center text-sm hover:bg-red-500 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function VisionBoardTab() {
  const { profile, addToBoard, removeFromBoard } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredItems = useMemo(() => {
    return VISION_SEARCH_ITEMS.filter(item => {
      const matchSearch = !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, activeCategory]);

  const handleAddCustom = () => {
    const clean = customInput.trim();
    if (!clean) return;
    const reason = getBlockedReason(clean);
    if (reason) {
      setCustomError(reason);
      setTimeout(() => setCustomError(''), 3000);
      return;
    }
    // Custom items get a default color
    addToBoard({ emoji: '⭐', label: clean, color: 'from-yellow-400 to-orange-500', category: 'Custom' });
    setCustomInput('');
    setCustomError('');
  };

  const boardItems = profile.visionBoard;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-black text-white">Vision Board</h2>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">{boardItems.length} items</span>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <span>{showSearch ? '×' : '+'}</span>
              {showSearch ? 'Close' : 'Add Items'}
            </button>
          </div>
        </div>
        <p className="text-white/40 text-sm">Your visual identity — no faces, just vibes ✨</p>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div className="border-b border-white/5 p-5 space-y-4 animate-slide-up"
          style={{ background: 'rgba(155, 93, 229, 0.04)' }}>

          {/* Custom item */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Add custom item</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={e => { setCustomInput(e.target.value); setCustomError(''); }}
                placeholder="e.g. Vintage cameras, Rooftop gardens..."
                className="input-field flex-1 text-sm"
                maxLength={40}
                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
              />
              <button onClick={handleAddCustom} disabled={!customInput.trim()} className="btn-primary px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                Add
              </button>
            </div>
            {customError && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {customError}
              </p>
            )}
          </div>

          {/* Search */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Browse & search</p>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search activities, places, foods..."
              className="input-field text-sm mb-3"
            />

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: activeCategory === cat
                      ? 'linear-gradient(135deg, #ff2d78, #9b5de5)'
                      : 'rgba(255,255,255,0.07)',
                    color: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.5)',
                    border: '1px solid ' + (activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)'),
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="col-span-2 text-center py-6 text-white/30 text-sm">
                No results found. Try a different search.
              </div>
            ) : (
              filteredItems.map((item, i) => (
                <SearchResultItem
                  key={i}
                  item={item}
                  isAdded={!!boardItems.find(b => b.label === item.label)}
                  onAdd={addToBoard}
                  onRemove={removeFromBoard}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Vision Board */}
      <div className="flex-1 overflow-y-auto p-5">
        {boardItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-64 text-center">
            <div className="text-6xl mb-4 opacity-30">🎨</div>
            <h3 className="text-white/50 font-bold text-lg mb-2">Your vision board is empty</h3>
            <p className="text-white/30 text-sm mb-5">Add images, places, activities and vibes to tell your story without showing your face.</p>
            <button
              onClick={() => setShowSearch(true)}
              className="btn-primary px-6 py-3 text-sm"
            >
              + Start Building
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-3 gap-2" style={{ gridAutoRows: '100px' }}>
              {boardItems.map((item, i) => (
                <VisionTile
                  key={item.label}
                  item={item}
                  index={i}
                  onRemove={removeFromBoard}
                />
              ))}
              {/* Add more tile */}
              <button
                onClick={() => setShowSearch(true)}
                className="col-span-1 row-span-1 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 text-white/30 hover:text-white/60 hover:border-white/30 transition-all"
                style={{ minHeight: '100px' }}
              >
                <span className="text-2xl">+</span>
                <span className="text-xs font-semibold">Add more</span>
              </button>
            </div>

            {/* Info note */}
            <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-xs text-white/40"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span>🔒</span>
              <span>No face photos allowed. Your vision board shows your passions, not your appearance.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
