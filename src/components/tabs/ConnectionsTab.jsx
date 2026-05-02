import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { isContentSafe, getBlockedReason } from '../../utils/contentFilter';
import { CHAT_PROMPTS, extractDiscoveries, getNextPrompt } from '../../utils/chatPrompts';

// Seed messages for demo connections
const SEED_MESSAGES = {
  1: [
    { id: 'm1', from: 'them', type: 'text', text: 'Hey! Saw you love jazz and photography too 📷', time: '2:30 PM' },
    { id: 'm2', from: 'me', type: 'text', text: 'Yes! Always looking for someone to explore photo walks with 🎞️', time: '2:32 PM' },
    { id: 'm3', from: 'them', type: 'text', text: 'That sounds incredible. I know this great spot at golden hour 🌅', time: '2:35 PM' },
  ],
  2: [
    { id: 'm1', from: 'them', type: 'text', text: 'Fellow rock climber here! Do you prefer bouldering or routes?', time: 'Yesterday' },
    { id: 'm2', from: 'me', type: 'text', text: 'Bouldering mostly but I love outdoor crags in the summer!', time: 'Yesterday' },
  ],
  3: [],
};

function DayCounterBar({ days, required = 90 }) {
  const pct = Math.min(100, (days / required) * 100);
  const remaining = Math.max(0, required - days);
  const color = pct >= 100 ? '#00f5d4' : pct >= 60 ? '#9b5de5' : '#ff2d78';

  return (
    <div className="px-4 py-3 border-b border-white/5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: pct >= 100 ? '#00f5d4' : 'rgba(255,255,255,0.5)' }}>
          <span>📹</span>
          <span>{pct >= 100 ? 'Video call unlocked!' : `Video call in ${remaining} days`}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>
          {days}/{required} days
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
      </div>
    </div>
  );
}

function PromptCard({ prompt, onSend }) {
  return (
    <div className="mx-4 my-2 animate-slide-up">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(155, 93, 229, 0.08)', border: '1px solid rgba(155, 93, 229, 0.25)' }}>
        <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
          <span className="text-base">{prompt.icon}</span>
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">{prompt.category} Prompt</span>
          <span className="ml-auto text-xs text-white/30">Tap to answer</span>
        </div>
        <div className="p-4">
          <p className="text-white font-semibold text-sm mb-3 leading-snug">❝ {prompt.question} ❞</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(prompt.keywords).slice(0, 4).map((kw, i) => (
              <button
                key={i}
                onClick={() => onSend(`${kw.emoji} ${kw.label}! That's so me.`)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {kw.emoji} {kw.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoveryToast({ items, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-slide-up"
      style={{ width: 'calc(100% - 48px)', maxWidth: '360px' }}>
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(155, 93, 229, 0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 30px rgba(155,93,229,0.4)' }}>
        <p className="text-white font-bold text-sm mb-2">✨ Added to Discovery Board!</p>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
              {item.emoji} {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isMe = msg.from === 'me';

  if (msg.type === 'prompt') {
    return (
      <div className="flex justify-center my-1 px-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(155,93,229,0.1)', border: '1px solid rgba(155,93,229,0.2)', color: '#c77dff' }}>
          <span>{msg.promptIcon}</span>
          <span>Prompt sent</span>
        </div>
      </div>
    );
  }

  if (msg.type === 'discovery') {
    return (
      <div className="flex justify-center my-2 px-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.2)', color: '#00f5d4' }}>
          <span>✨</span>
          <span>Discovery: <strong>{msg.items.map(i => i.label).join(', ')}</strong> added to board</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1.5 px-4`}>
      <div
        className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={{
          background: isMe
            ? 'linear-gradient(135deg, #ff2d78, #9b5de5)'
            : 'rgba(255,255,255,0.09)',
          borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          color: 'white',
        }}
      >
        <p>{msg.text}</p>
        <p className="text-xs mt-0.5 text-white/40 text-right">{msg.time}</p>
      </div>
    </div>
  );
}

function ChatView({ user, onBack }) {
  const { getMessages, addMessage, addToDiscoveryBoard, getDaysConnected, setActiveCall } = useApp();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [localMessages, setLocalMessages] = useState(() => {
    return SEED_MESSAGES[user.id] || [];
  });
  const [usedPromptIds, setUsedPromptIds] = useState([]);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [discoveryToast, setDiscoveryToast] = useState(null);
  const [promptCooldown, setPromptCooldown] = useState(false);
  const messagesEndRef = useRef(null);
  const days = getDaysConnected(user);
  const videoUnlocked = days >= 90;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, pendingPrompt]);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = (textOverride) => {
    const text = textOverride || input.trim();
    if (!text) return;

    const reason = getBlockedReason(text);
    if (reason) {
      setError(reason);
      setTimeout(() => setError(''), 3000);
      return;
    }

    const msg = { id: Date.now(), from: 'me', type: 'text', text, time: now() };
    setLocalMessages(prev => [...prev, msg]);
    setInput('');
    setError('');
    setPendingPrompt(null);

    // Check for discoveries
    if (pendingPrompt) {
      const discoveries = extractDiscoveries(text, pendingPrompt);
      if (discoveries.length > 0) {
        discoveries.forEach(d => addToDiscoveryBoard(d));
        setDiscoveryToast(discoveries);
        setTimeout(() => {
          setLocalMessages(prev => [...prev, {
            id: Date.now() + 1, from: 'system', type: 'discovery',
            items: discoveries, time: now(),
          }]);
        }, 300);
      }
    }

    // Simulate reply
    setTimeout(() => {
      const replies = [
        'That\'s such a vibe! I feel the same 🎉',
        'Yes!! 100% agree with you on that',
        'Omg same! We should plan something 🌟',
        'You have such great taste honestly',
        'Never thought about it that way, but YES',
        'This is why we connected 😄',
        'I could talk about this forever lol',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setLocalMessages(prev => [...prev, {
        id: Date.now() + 2, from: 'them', type: 'text', text: reply, time: now(),
      }]);

      // Offer a prompt after every 3rd reply if no cooldown
      if (!promptCooldown && localMessages.length % 3 === 2) {
        const nextPrompt = getNextPrompt(usedPromptIds);
        if (nextPrompt) {
          setTimeout(() => {
            setPendingPrompt(nextPrompt);
            setUsedPromptIds(prev => [...prev, nextPrompt.id]);
            setPromptCooldown(true);
            setTimeout(() => setPromptCooldown(false), 8000);
          }, 1000);
        }
      }
    }, 1000 + Math.random() * 800);
  };

  const handleSendPrompt = () => {
    const nextPrompt = getNextPrompt(usedPromptIds);
    if (!nextPrompt) return;
    setUsedPromptIds(prev => [...prev, nextPrompt.id]);
    setPendingPrompt(nextPrompt);
    setLocalMessages(prev => [...prev, {
      id: Date.now(), from: 'system', type: 'prompt',
      promptIcon: nextPrompt.icon, time: now(),
    }]);
  };

  return (
    /* h-full + flex-col fills the parent slot from AppShell; min-h-0 prevents flex overflow */
    <div className="flex flex-col h-full min-h-0">

      {/* ── Chat header ── */}
      <div
        className="flex-shrink-0 px-3 sm:px-4 py-3 border-b border-white/5 flex items-center gap-2 sm:gap-3"
        style={{ background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(20px)' }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
        >←</button>

        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white text-xs sm:text-sm bg-gradient-to-br ${user.avatarColor} flex-shrink-0`}>
          {user.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{user.alias}</p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
            {days}d connected
          </p>
        </div>

        {/* Call buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveCall({ user, type: 'voice' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base active:scale-95 transition-all"
            style={{ background: 'rgba(0,245,212,0.12)', border: '1px solid rgba(0,245,212,0.25)' }}
            title="Voice Call"
          >📞</button>

          <button
            onClick={() => videoUnlocked && setActiveCall({ user, type: 'video' })}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all"
            style={{
              background: videoUnlocked ? 'rgba(155,93,229,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${videoUnlocked ? 'rgba(155,93,229,0.4)' : 'rgba(255,255,255,0.1)'}`,
              opacity: videoUnlocked ? 1 : 0.5,
              cursor: videoUnlocked ? 'pointer' : 'not-allowed',
            }}
            title={videoUnlocked ? 'Video Call' : `Unlocks in ${90 - days} more days`}
          >
            📹
            {!videoUnlocked && <span className="absolute -top-1 -right-1 text-xs leading-none">🔒</span>}
          </button>
        </div>
      </div>

      {/* ── 90-day bar ── */}
      <div className="flex-shrink-0"><DayCounterBar days={days} /></div>

      {/* ── Shared vibes ── */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <span className="text-white/30 text-xs flex-shrink-0 font-semibold">Shared:</span>
        {user.likes.slice(0, 4).map((l, i) => (
          <span key={i} className="flex-shrink-0 tag-like" style={{ fontSize: '11px' }}>{l}</span>
        ))}
      </div>

      {/* ── Messages scrollable area — flex-1 min-h-0 is key ── */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-3">
        {localMessages.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-4xl mb-2">👋</p>
            <p className="text-white/40 text-sm">Start the convo! You both love <strong className="text-white/60">{user.likes[0]}</strong></p>
          </div>
        )}
        {localMessages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}

        {pendingPrompt && <PromptCard prompt={pendingPrompt} onSend={sendMessage} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Discovery toast */}
      {discoveryToast && <DiscoveryToast items={discoveryToast} onDismiss={() => setDiscoveryToast(null)} />}

      {/* ── Input area — flex-shrink-0 keeps it pinned ── */}
      <div className="flex-shrink-0 border-t border-white/5 pb-safe" style={{ background: 'rgba(10,10,15,0.98)' }}>
        {error && (
          <div className="mx-4 mt-2 px-3 py-2 rounded-xl text-xs text-red-400 flex items-center gap-1.5"
            style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)' }}>
            <span>⚠️</span> {error}
          </div>
        )}
        <div className="px-3 sm:px-4 pt-2 pb-2 flex items-center gap-2">
          <button
            onClick={handleSendPrompt}
            title="Send a discovery prompt"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
            style={{ background: 'rgba(155,93,229,0.15)', border: '1px solid rgba(155,93,229,0.3)', fontSize: '16px' }}
          >❓</button>

          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="Message..."
            className="input-field flex-1 text-sm"
            style={{ padding: '10px 14px' }}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            maxLength={300}
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: 'linear-gradient(135deg, #ff2d78, #9b5de5)', fontSize: '16px' }}
          >➤</button>
        </div>
        <p className="text-center text-white/15 text-xs pb-1.5 px-4">
          🔒 Filtered · ❓ Prompts → Discovery Board
        </p>
      </div>
    </div>
  );
}

export default function ConnectionsTab() {
  const { connections, getDaysConnected } = useApp();
  const [activeChat, setActiveChat] = useState(null);

  if (activeChat) {
    return <ChatView user={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-white/5">
        <h2 className="text-lg sm:text-xl font-black text-white">Connections</h2>
        <p className="text-white/40 text-xs sm:text-sm">{connections.length} friends · chat, call & video</p>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 px-4 sm:px-5 py-2.5 border-b border-white/5 flex items-center gap-3 sm:gap-4 overflow-x-auto">
        {[
          { icon: '💬', label: 'Chat anytime', color: 'rgba(255,255,255,0.4)' },
          { icon: '📞', label: 'Voice call', color: '#00f5d4' },
          { icon: '📹', label: 'Video @ 90 days', color: '#9b5de5' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: item.color }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Connection list */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-2.5 sm:space-y-3">
        {connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-white font-black text-lg mb-2">No connections yet</h3>
            <p className="text-white/40 text-sm">Go to Discover and start connecting to find your people!</p>
          </div>
        ) : (
          connections.map((user) => {
            const days = getDaysConnected(user);
            const videoUnlocked = days >= 90;
            const pct = Math.min(100, (days / 90) * 100);

            return (
              <button
                key={user.id}
                onClick={() => setActiveChat(user)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-sm bg-gradient-to-br ${user.avatarColor}`}>
                    {user.avatar}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2"
                    style={{ borderColor: '#0a0a0f' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white font-bold truncate">{user.alias}</p>
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      {/* Voice badge */}
                      <span className="text-sm">📞</span>
                      {/* Video with lock or unlocked */}
                      <span className="text-sm relative">
                        📹
                        {!videoUnlocked && (
                          <span className="absolute -top-1 -right-1 text-xs leading-none">🔒</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/30 text-xs flex items-center gap-1.5 mb-2">
                    <span className="font-semibold" style={{ color: user.matchScore >= 90 ? '#00f5d4' : user.matchScore >= 75 ? '#9b5de5' : '#ff2d78' }}>
                      {user.matchScore}% vibe
                    </span>
                    <span>·</span>
                    <span>{days}d connected</span>
                  </p>

                  {/* Video unlock progress */}
                  {!videoUnlocked && (
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-white/25 text-xs">📹 Video in {90 - days}d</span>
                        <span className="text-white/25 text-xs">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #9b5de5, #ff2d78)' }} />
                      </div>
                    </div>
                  )}
                  {videoUnlocked && (
                    <p className="text-xs font-semibold flex items-center gap-1" style={{ color: '#00f5d4' }}>
                      <span>✨</span> Video call unlocked!
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Privacy note */}
      <div className="px-4 pb-4">
        <div className="p-3 rounded-xl flex items-center gap-2 text-xs text-white/30"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span>🔒</span>
          <span>Real identity never shared · Video unlocks after 90 days of connection</span>
        </div>
      </div>
    </div>
  );
}
