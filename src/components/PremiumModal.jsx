import React from 'react';
import { useAuth } from '../context/AuthContext';
import { openCheckout } from '../lib/stripe';

const FEATURES = [
  { label: 'Discover & match',          free: true,  premium: true  },
  { label: 'Chat with friends',         free: true,  premium: true  },
  { label: 'Vibe Board',                free: true,  premium: true  },
  { label: 'Discoveries Board',         free: true,  premium: true  },
  { label: 'Voice calls',               free: true,  premium: true  },
  { label: 'Video calls (90-day rule)', free: true,  premium: true  },
  { label: 'Green Flags Board',         free: false, premium: true  },
  { label: 'Red Flags Board',           free: false, premium: true  },
  { label: 'Unlimited daily cards',     free: false, premium: true  },
  { label: 'Priority discovery',        free: false, premium: true  },
  { label: '✨ Premium profile badge',  free: false, premium: true  },
];

export default function PremiumModal({ onClose, featureName }) {
  const { currentEmail, isPremium } = useAuth();

  function handleUpgrade() {
    openCheckout(currentEmail);
  }

  if (isPremium) {
    // Shouldn't normally appear but just in case
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#0e0e1a', border: '1px solid rgba(155,93,229,0.4)', boxShadow: '0 24px 80px rgba(155,93,229,0.2)' }}
      >
        {/* Gradient bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #ff2d78, #9b5de5, #00f5d4)' }} />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-3xl mb-3"
              style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.3), rgba(255,45,120,0.3))', border: '1px solid rgba(155,93,229,0.4)' }}>
              ✨
            </div>
            <h2 className="text-white font-black text-2xl mb-1">FriendUs Premium</h2>
            {featureName && (
              <p className="text-white/40 text-sm">
                <span className="text-purple-400 font-semibold">"{featureName}"</span> is a Premium feature
              </p>
            )}
          </div>

          {/* Price pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-baseline gap-1 px-5 py-2 rounded-full"
              style={{ background: 'rgba(155,93,229,0.15)', border: '1px solid rgba(155,93,229,0.3)' }}>
              <span className="text-white font-black text-2xl">$4.99</span>
              <span className="text-white/40 text-sm font-medium">/ month</span>
            </div>
          </div>

          {/* Feature comparison */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}>
              <span>Feature</span>
              <span className="text-center w-12">Free</span>
              <span className="text-center w-16 text-purple-400">Premium</span>
            </div>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2.5 text-sm"
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ color: f.premium ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)' }}>{f.label}</span>
                <span className="text-center w-12 text-base">{f.free ? '✓' : '—'}</span>
                <span className="text-center w-16 text-base"
                  style={{ color: '#9b5de5' }}>
                  {f.premium ? '✓' : '—'}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className="w-full py-4 rounded-2xl font-black text-white text-base transition-all mb-3"
            style={{
              background: 'linear-gradient(135deg, #ff2d78, #9b5de5)',
              boxShadow: '0 4px 24px rgba(155,93,229,0.45)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,93,229,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(155,93,229,0.45)'; }}
          >
            ✨ Upgrade to Premium — $4.99/mo
          </button>

          <p className="text-center text-xs mb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Cancel anytime · Secure checkout via Stripe
          </p>

          <button onClick={onClose}
            className="w-full text-xs text-center"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
