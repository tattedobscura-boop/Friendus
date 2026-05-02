import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const NOW = Date.now();
const DAYS_AGO = (n) => NOW - n * 24 * 60 * 60 * 1000;

const DEMO_CONNECTIONS = [
  {
    id: 1, alias: 'NeonDreamer', avatar: 'ND', avatarColor: 'from-purple-500 to-pink-500',
    matchScore: 94, connectedAt: DAYS_AGO(92),
    likes: ['Photography', 'Jazz', 'Coffee', 'Travel', 'Film Making'],
    dislikes: ['Early mornings', 'Loud crowds', 'Fast food'],
    interests: ['Philosophy', 'Indie Music', 'Stargazing'],
    visionBoard: [
      { emoji: '📷', label: 'Photography', color: 'from-violet-500 to-purple-600' },
      { emoji: '☕', label: 'Coffee', color: 'from-amber-600 to-orange-700' },
      { emoji: '🎷', label: 'Jazz', color: 'from-blue-500 to-indigo-600' },
    ],
  },
  {
    id: 2, alias: 'WildMosaic', avatar: 'WM', avatarColor: 'from-cyan-500 to-teal-500',
    matchScore: 87, connectedAt: DAYS_AGO(45),
    likes: ['Rock Climbing', 'Cooking', 'Podcasts', 'Yoga', 'Reading'],
    dislikes: ['Negativity', 'Waste', 'Small talk'],
    interests: ['Psychology', 'Hiking', 'Meditation'],
    visionBoard: [
      { emoji: '🧗', label: 'Rock Climbing', color: 'from-stone-500 to-slate-600' },
      { emoji: '👩‍🍳', label: 'Cooking', color: 'from-orange-400 to-red-500' },
    ],
  },
  {
    id: 3, alias: 'PixelSage', avatar: 'PS', avatarColor: 'from-orange-500 to-pink-500',
    matchScore: 81, connectedAt: DAYS_AGO(12),
    likes: ['Gaming', 'Anime', 'Coding', 'Sci-Fi', 'Board Games'],
    dislikes: ['Slow internet', 'Seriousness'],
    interests: ['AI & Machine Learning', 'Fantasy', 'VR/AR'],
    visionBoard: [
      { emoji: '🎮', label: 'Gaming', color: 'from-green-500 to-emerald-600' },
      { emoji: '🤖', label: 'AI', color: 'from-violet-500 to-purple-600' },
    ],
  },
];

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [activeTab, setActiveTab] = useState('discover');
  const [profile, setProfile] = useState({
    alias: '',
    likes: [],
    dislikes: [],
    interests: [],
    vibeBoard: [],
    discoveryBoard: [],
    redFlagBoard: [],
  });

  const [connections, setConnections] = useState(DEMO_CONNECTIONS);
  const [notifications, setNotifications] = useState(2);
  const [messageStore, setMessageStore] = useState({});
  const [activeCall, setActiveCall] = useState(null); // { user, type: 'voice'|'video' }

  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  // --- Vibe Board ---
  const addToVibeBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.vibeBoard.find(v => v.label === item.label)) return prev;
      return { ...prev, vibeBoard: [...prev.vibeBoard, item] };
    });
  }, []);
  const removeFromVibeBoard = useCallback((label) => {
    setProfile(prev => ({ ...prev, vibeBoard: prev.vibeBoard.filter(v => v.label !== label) }));
  }, []);

  // Legacy compat for onboarding
  const addToBoard = addToVibeBoard;
  const removeFromBoard = removeFromVibeBoard;

  // --- Discovery Board ---
  const addToDiscoveryBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.discoveryBoard.find(v => v.label === item.label)) return prev;
      return { ...prev, discoveryBoard: [...prev.discoveryBoard, item] };
    });
  }, []);
  const removeFromDiscoveryBoard = useCallback((label) => {
    setProfile(prev => ({ ...prev, discoveryBoard: prev.discoveryBoard.filter(v => v.label !== label) }));
  }, []);

  // --- Red Flag Board ---
  const addToRedFlagBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.redFlagBoard.find(v => v.label === item.label)) return prev;
      return { ...prev, redFlagBoard: [...prev.redFlagBoard, item] };
    });
  }, []);
  const removeFromRedFlagBoard = useCallback((label) => {
    setProfile(prev => ({ ...prev, redFlagBoard: prev.redFlagBoard.filter(v => v.label !== label) }));
  }, []);

  // --- Connections ---
  const addConnection = useCallback((user) => {
    setConnections(prev => {
      if (prev.find(c => c.id === user.id)) return prev;
      return [{ ...user, connectedAt: Date.now() }, ...prev];
    });
  }, []);

  const getDaysConnected = useCallback((user) => {
    if (!user?.connectedAt) return 0;
    return Math.floor((Date.now() - user.connectedAt) / (24 * 60 * 60 * 1000));
  }, []);

  // --- Messages ---
  const getMessages = useCallback((userId) => {
    return messageStore[userId] || [];
  }, [messageStore]);

  const addMessage = useCallback((userId, msg) => {
    setMessageStore(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), msg],
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      activeTab, setActiveTab,
      profile, updateProfile,
      addToBoard, removeFromBoard,
      addToVibeBoard, removeFromVibeBoard,
      addToDiscoveryBoard, removeFromDiscoveryBoard,
      addToRedFlagBoard, removeFromRedFlagBoard,
      connections, addConnection,
      notifications, setNotifications,
      messageStore, getMessages, addMessage,
      activeCall, setActiveCall,
      getDaysConnected,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
