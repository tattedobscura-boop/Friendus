import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../utils/mockData';
import { isContentSafe, getBlockedReason } from '../../utils/contentFilter';

const MOCK_MESSAGES = {
  1: [
    { from: 'them', text: 'Hey! Saw you love jazz and photography too 📷', time: '2:30 PM' },
    { from: 'me', text: 'Yes! Always looking for someone to explore photo walks with', time: '2:32 PM' },
    { from: 'them', text: 'That sounds amazing. I know this great spot at golden hour 🌅', time: '2:35 PM' },
  ],
  2: [
    { from: 'them', text: 'Fellow rock climber! Which gym do you go to?', time: 'Yesterday' },
    { from: 'me', text: 'I mostly boulder but I love outdoor crags!', time: 'Yesterday' },
  ],
};

function MessageBubble({ msg }) {
  return (
    <div className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
        msg.from === 'me'
          ? 'rounded-br-sm text-white'
          : 'rounded-bl-sm text-white'
      }`}
        style={{
          background: msg.from === 'me'
            ? 'linear-gradient(135deg, #ff2d78, #9b5de5)'
            : 'rgba(255,255,255,0.1)',
        }}>
        <p>{msg.text}</p>
        <p className="text-white/40 text-xs mt-0.5 text-right">{msg.time}</p>
      </div>
    </div>
  );
}

function ChatView({ user, onBack }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES[user.id] || []);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reason = getBlockedReason(text);
    if (reason) {
      setError(reason);
      setTimeout(() => setError(''), 3000);
      return;
    }
    setMessages(prev => [...prev, { from: 'me', text, time: 'Now' }]);
    setInput('');
    setError('');

    // Simulate reply
    setTimeout(() => {
      const replies = [
        'That\'s so cool! I love that too 🎉',
        'Totally agree with you on that!',
        'We should hang out sometime — just vibes 🌟',
        'You have such great taste!',
        'I never thought about it that way, but yes!',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, { from: 'them', text: reply, time: 'Now' }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors mr-1">
          ←
        </button>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white bg-gradient-to-br ${user.avatarColor} flex-shrink-0`}>
          {user.avatar}
        </div>
        <div>
          <p className="text-white font-bold text-sm">{user.alias}</p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Active now
          </p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(0, 245, 212, 0.1)',
              border: '1px solid rgba(0, 245, 212, 0.2)',
              color: '#00f5d4',
            }}>
            {user.matchScore}% match
          </div>
        </div>
      </div>

      {/* Shared vibes bar */}
      <div className="px-5 py-3 border-b border-white/5">
        <p className="text-xs text-white/30 mb-1.5">Shared vibes with {user.alias}</p>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {user.likes.slice(0, 4).map((l, i) => (
            <span key={i} className="flex-shrink-0 tag-like text-xs">{l}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">👋</p>
            <p className="text-white/40 text-sm">Start the conversation!</p>
            <p className="text-white/20 text-xs mt-1">You both love {user.likes[0]}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mb-2 px-3 py-2 rounded-lg text-xs text-red-400 flex items-center gap-1"
          style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)' }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Input */}
      <div className="px-5 pb-5 pt-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="Message..."
            className="input-field flex-1 text-sm"
            onKeyDown={e => e.key === 'Enter' && send()}
            maxLength={200}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="btn-primary px-4 py-2.5 text-sm disabled:opacity-40"
          >
            →
          </button>
        </div>
        <p className="text-center text-white/20 text-xs mt-2">🔒 All messages are moderated for safety</p>
      </div>
    </div>
  );
}

export default function ConnectionsTab() {
  const { connections, profile } = useApp();
  const [activeChat, setActiveChat] = useState(null);

  // Seed some connections for demo
  const allConnections = connections.length > 0 ? connections : [MOCK_USERS[0], MOCK_USERS[1]];

  if (activeChat) {
    return <ChatView user={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <h2 className="text-xl font-black text-white">Connections</h2>
        <p className="text-white/40 text-sm">{allConnections.length} vibe matches</p>
      </div>

      {/* Connection list */}
      <div className="flex-1 overflow-y-auto">
        {allConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-white font-black text-lg mb-2">No connections yet</h3>
            <p className="text-white/40 text-sm">Go to Discover and start swiping to find your people!</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {allConnections.map((user, i) => (
              <button
                key={user.id || i}
                onClick={() => setActiveChat(user)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left hover:scale-[1.01]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Avatar */}
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-sm bg-gradient-to-br ${user.avatarColor} flex-shrink-0`}>
                  {user.avatar}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2"
                    style={{ borderColor: '#0a0a0f' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold truncate">{user.alias}</p>
                    <span className="text-white/30 text-xs ml-2 flex-shrink-0">2m ago</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-white/40 text-xs flex-shrink-0">{user.matchScore}% match •</span>
                    <div className="flex gap-1 overflow-hidden">
                      {user.likes.slice(0, 2).map((l, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: 'rgba(0, 245, 212, 0.1)',
                            color: 'rgba(0, 245, 212, 0.7)',
                            fontSize: '10px',
                          }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-white/30 text-xs mt-1 truncate">
                    {MOCK_MESSAGES[user.id]
                      ? MOCK_MESSAGES[user.id][MOCK_MESSAGES[user.id].length - 1]?.text
                      : 'Say hi! 👋'}
                  </p>
                </div>

                <div className="flex-shrink-0 text-white/20 text-lg">›</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="px-5 pb-5">
        <div className="p-3 rounded-xl flex items-center gap-2 text-xs text-white/30"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span>🔒</span>
          <span>Your real identity is never shared. Connect through vibes only.</span>
        </div>
      </div>
    </div>
  );
}
