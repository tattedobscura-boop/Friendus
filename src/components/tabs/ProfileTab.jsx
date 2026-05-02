import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isContentSafe, getBlockedReason, sanitizeText } from '../../utils/contentFilter';

function EditableTagSection({ title, icon, tags, onAdd, onRemove, type, placeholder }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const tagClass = type === 'likes' ? 'tag-like' : type === 'dislikes' ? 'tag-dislike' : 'tag-interest';

  const handleAdd = () => {
    const clean = sanitizeText(input);
    if (!clean) return;
    const reason = getBlockedReason(clean);
    if (reason) {
      setError(reason);
      setTimeout(() => setError(''), 3000);
      return;
    }
    onAdd(clean);
    setInput('');
  };

  return (
    <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
          <span>{icon}</span> {title}
          <span className="normal-case text-white/30 font-normal tracking-normal">({tags.length})</span>
        </p>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs px-2.5 py-1 rounded-lg transition-all"
          style={{
            background: editing ? 'rgba(155, 93, 229, 0.2)' : 'rgba(255,255,255,0.07)',
            color: editing ? '#c77dff' : 'rgba(255,255,255,0.4)',
            border: '1px solid ' + (editing ? 'rgba(155, 93, 229, 0.3)' : 'rgba(255,255,255,0.1)'),
          }}
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.length === 0 && (
          <span className="text-white/20 text-xs italic">Nothing added yet</span>
        )}
        {tags.map((tag, i) => (
          <span key={i} className={tagClass}>
            {tag}
            {editing && (
              <button onClick={() => onRemove(tag)} className="ml-1 opacity-70 hover:opacity-100 text-xs">×</button>
            )}
          </span>
        ))}
      </div>

      {editing && (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder={placeholder}
              className="input-field flex-1 text-sm py-2"
              maxLength={50}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd} disabled={!input.trim()} className="btn-primary px-3 text-xs disabled:opacity-40">
              +
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfileTab() {
  const { profile, updateProfile } = useApp();

  const [likes, setLikes] = useState(profile.likes || []);
  const [dislikes, setDislikes] = useState(profile.dislikes || []);
  const [interests, setInterests] = useState(profile.interests || []);

  const handleSave = () => {
    updateProfile({ likes, dislikes, interests });
  };

  const totalTags = likes.length + dislikes.length + interests.length;

  // Completeness
  const completeness = Math.min(100, Math.round(
    (likes.length > 0 ? 30 : 0) +
    (dislikes.length > 0 ? 15 : 0) +
    (interests.length > 0 ? 20 : 0) +
    (profile.vibeBoard?.length > 0 ? 20 : 0) +
    Math.min(15, totalTags)
  ));

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>
              {profile.alias ? profile.alias.substring(0, 2).toUpperCase() : '??'}
            </div>
            {/* No face badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: '#0a0a0f', border: '2px solid rgba(255,255,255,0.1)' }}>
              🎭
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">{profile.alias || 'Your Alias'}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-green-400 text-xs font-semibold">Face-free · Anonymous</span>
              <span className="text-white/20 mx-1">•</span>
              <span className="text-white/40 text-xs">{totalTags} interest tags</span>
            </div>

            {/* Completeness bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/40">Profile completeness</span>
                <span className="text-xs font-bold" style={{
                  color: completeness >= 80 ? '#00f5d4' : completeness >= 50 ? '#9b5de5' : '#ff2d78'
                }}>{completeness}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completeness}%`,
                    background: completeness >= 80 ? 'linear-gradient(90deg, #00f5d4, #9b5de5)' :
                      completeness >= 50 ? 'linear-gradient(90deg, #9b5de5, #ff2d78)' :
                      '#ff2d78',
                  }} />
              </div>
            </div>
          </div>
        </div>

        {/* Anonymous note */}
        <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-xs"
          style={{
            background: 'rgba(255, 45, 120, 0.06)',
            border: '1px solid rgba(255, 45, 120, 0.15)',
            color: 'rgba(255, 45, 120, 0.8)',
          }}>
          <span className="text-lg">🙈</span>
          <span>Your face is never shown here — not now, not ever. Only your interests and personality matter on FriendUs.</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: likes.length, label: 'Loves', color: '#00f5d4' },
            { n: dislikes.length, label: 'Dislikes', color: '#ff2d78' },
            { n: interests.length, label: 'Passions', color: '#9b5de5' },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.n}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editable sections */}
      <div className="px-5 pb-5 space-y-3">
        <EditableTagSection
          title="Loves"
          icon="💚"
          tags={likes}
          onAdd={t => { setLikes(p => [...p, t]); handleSave(); }}
          onRemove={t => { setLikes(p => p.filter(x => x !== t)); handleSave(); }}
          type="likes"
          placeholder="Add something you love..."
        />
        <EditableTagSection
          title="Not My Vibe"
          icon="🚫"
          tags={dislikes}
          onAdd={t => { setDislikes(p => [...p, t]); handleSave(); }}
          onRemove={t => { setDislikes(p => p.filter(x => x !== t)); handleSave(); }}
          type="dislikes"
          placeholder="Add something you dislike..."
        />
        <EditableTagSection
          title="Passions"
          icon="🔮"
          tags={interests}
          onAdd={t => { setInterests(p => [...p, t]); handleSave(); }}
          onRemove={t => { setInterests(p => p.filter(x => x !== t)); handleSave(); }}
          type="interests"
          placeholder="Add a deep passion..."
        />
      </div>

      {/* Vision board preview */}
      {profile.vibeBoard?.length > 0 && (
        <div className="px-5 pb-8">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">🎨 Vision Board Preview</p>
            <div className="grid grid-cols-4 gap-2">
              {profile.vibeBoard.slice(0, 8).map((item, i) => (
                <div key={i} className={`rounded-xl bg-gradient-to-br ${item.color} flex flex-col items-center justify-center p-2 aspect-square`}>
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-white font-semibold text-center leading-tight mt-1"
                    style={{ fontSize: '9px' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy settings */}
      <div className="px-5 pb-8">
        <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider">🔐 Privacy</p>
          {[
            { label: 'Anonymous mode', desc: 'Hide all personal identifiers', value: true },
            { label: 'Block face photos', desc: 'Cannot upload face images', value: true },
            { label: 'Content filtering', desc: 'Block inappropriate content', value: true },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{s.label}</p>
                <p className="text-white/30 text-xs">{s.desc}</p>
              </div>
              <div className="w-10 h-6 rounded-full flex items-center px-0.5"
                style={{ background: s.value ? 'linear-gradient(135deg, #00f5d4, #9b5de5)' : 'rgba(255,255,255,0.1)' }}>
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${s.value ? 'translate-x-4' : 'translate-x-0'}`}
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
