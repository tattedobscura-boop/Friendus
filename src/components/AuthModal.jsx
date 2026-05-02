import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, defaultTab = 'signin' }) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab]           = useState(defaultTab); // 'signin' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias]       = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  function switchTab(t) {
    setTab(t);
    setError('');
    setEmail('');
    setPassword('');
    setAlias('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 350)); // feel of async

    let result;
    if (tab === 'signup') {
      result = signUp(email, password, alias);
    } else {
      result = signIn(email, password);
    }

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
    } else {
      onClose('success');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose('cancel'); }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#0e0e1a', border: '1px solid rgba(155,93,229,0.3)', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}
      >
        {/* Accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ff2d78, #9b5de5, #00f5d4)' }} />

        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)' }}>✦</div>
            <span className="text-white font-black text-lg tracking-tight">FriendUs</span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-2xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: tab === id ? 'linear-gradient(135deg, #ff2d78, #9b5de5)' : 'transparent',
                  color: tab === id ? 'white' : 'rgba(255,255,255,0.4)',
                  boxShadow: tab === id ? '0 2px 12px rgba(155,93,229,0.35)' : 'none',
                }}
              >{label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Your alias <span style={{ color: 'rgba(0,245,212,0.7)' }}>(no real name needed 🙈)</span>
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={e => setAlias(e.target.value)}
                  placeholder="e.g. SolarDrift, NeonDreamer…"
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    caretColor: '#9b5de5',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(155,93,229,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  caretColor: '#9b5de5',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(155,93,229,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Password {tab === 'signup' && <span style={{ color: 'rgba(255,255,255,0.3)' }}>(min 6 chars)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all pr-12"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    caretColor: '#9b5de5',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(155,93,229,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >{showPw ? '🙈' : '👁'}</button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', color: '#ff6b9d' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all mt-2"
              style={{
                background: loading ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, #ff2d78, #9b5de5)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(155,93,229,0.35)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Please wait…' : tab === 'signup' ? '🤝 Create My Account' : '→ Sign In'}
            </button>
          </form>

          {tab === 'signup' && (
            <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Your email is only for account recovery. It is never shown to other users.
            </p>
          )}

          <button
            onClick={() => onClose('cancel')}
            className="w-full pt-4 text-xs text-center"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}
