import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  supabase,
  fetchProfile, upsertProfile,
  fetchConnections, insertConnection,
  fetchMessages, insertMessage,
} from '../lib/supabase';

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

const DEFAULT_PROFILE = {
  alias: '', likes: [], dislikes: [], interests: [], values: [],
  vibeBoard: [], discoveryBoard: [], redFlagBoard: [], greenFlagBoard: [],
};

// Convert Supabase snake_case profile row → app camelCase shape
function dbRowToProfile(row) {
  if (!row) return null;
  return {
    alias:           row.alias          || '',
    likes:           row.likes          || [],
    dislikes:        row.dislikes       || [],
    interests:       row.interests      || [],
    values:          row.values         || [],
    vibeBoard:       row.vibe_board     || [],
    discoveryBoard:  row.discovery_board || [],
    redFlagBoard:    row.red_flag_board || [],
    greenFlagBoard:  row.green_flag_board || [],
  };
}

// Convert Supabase connections row → app connection shape
function dbRowToConnection(row) {
  const meta = row.friend_meta || {};
  return {
    id:          row.friend_id,
    alias:       row.friend_alias,
    avatar:      row.friend_avatar,
    avatarColor: row.friend_avatar_color,
    matchScore:  row.match_score,
    connectedAt: new Date(row.connected_at).getTime(),
    likes:       meta.likes       || [],
    dislikes:    meta.dislikes    || [],
    interests:   meta.interests   || [],
    visionBoard: meta.visionBoard || [],
    personality: meta.personality,
    values:      meta.values,
    icebreaker:  meta.icebreaker,
    distance:    meta.distance,
  };
}

// Convert Supabase messages row → app message shape
function dbRowToMessage(row) {
  const meta = row.meta || {};
  return {
    id:          row.id,
    from:        row.from_role,
    type:        row.type,
    text:        row.text,
    time:        row.time,
    promptIcon:  meta.promptIcon,
    items:       meta.items,
  };
}

const SUPABASE_READY =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project-id');

export function AppProvider({ children }) {
  const { isLoggedIn, currentUser, currentAccount, saveAppData, loadAppData, profile: authProfile, refreshProfile } = useAuth();

  // ── Offline mode: seed from localStorage ─────────────────────────────────
  function getOfflineSaved() {
    if (isLoggedIn) {
      const saved = loadAppData();
      if (saved) return saved;
    }
    return null;
  }

  const offlineSaved = getOfflineSaved();

  const [currentScreen, setCurrentScreen] = useState(() => {
    if (isLoggedIn && (authProfile?.profile_complete || offlineSaved?.profileComplete)) return 'app';
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState('discover');

  const [profile, setProfile] = useState(() => {
    // Supabase profile row already loaded via AuthContext
    if (authProfile) return dbRowToProfile(authProfile) || DEFAULT_PROFILE;
    if (offlineSaved?.profile) return offlineSaved.profile;
    if (isLoggedIn && currentAccount?.alias) return { ...DEFAULT_PROFILE, alias: currentAccount.alias };
    return { ...DEFAULT_PROFILE };
  });

  const [connections, setConnections] = useState(() => {
    if (offlineSaved?.connections) return offlineSaved.connections;
    return DEMO_CONNECTIONS;
  });

  const [notifications, setNotifications] = useState(2);
  const [messageStore, setMessageStore]   = useState(() => offlineSaved?.messageStore || {});
  const [activeCall, setActiveCall]       = useState(null);
  const [profileComplete, setProfileComplete] = useState(() => {
    return authProfile?.profile_complete || offlineSaved?.profileComplete || false;
  });

  // ── Sync when authProfile loads from Supabase ─────────────────────────────
  useEffect(() => {
    if (!authProfile) return;
    const mapped = dbRowToProfile(authProfile);
    if (mapped) setProfile(mapped);
    if (authProfile.profile_complete) {
      setProfileComplete(true);
      setCurrentScreen('app');
    }
  }, [authProfile]);

  // ── Load connections + seed messages from Supabase on login ───────────────
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id || currentUser?._offline) return;
    if (!SUPABASE_READY) return;

    fetchConnections(currentUser.id)
      .then(rows => {
        if (rows.length > 0) {
          setConnections(rows.map(dbRowToConnection));
        }
      })
      .catch(console.error);
  }, [isLoggedIn, currentUser]);

  // ── Offline localStorage persistence (debounced) ──────────────────────────
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!isLoggedIn || SUPABASE_READY) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveAppData({ profile, connections, messageStore, profileComplete });
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [profile, connections, messageStore, profileComplete, isLoggedIn, saveAppData]);

  // ── Re-init when user switches accounts ───────────────────────────────────
  const prevUserRef = useRef(null);
  useEffect(() => {
    const uid = currentUser?.id || currentUser?.email;
    if (!uid || uid === prevUserRef.current) return;
    prevUserRef.current = uid;

    if (!isLoggedIn) return;
    if (currentUser?._offline) {
      const saved = loadAppData();
      if (saved) {
        if (saved.profile)      setProfile(saved.profile);
        if (saved.connections)  setConnections(saved.connections);
        if (saved.messageStore) setMessageStore(saved.messageStore);
        if (saved.profileComplete) { setProfileComplete(true); setCurrentScreen('app'); }
        else setCurrentScreen('landing');
      } else {
        setProfile({ ...DEFAULT_PROFILE, alias: currentAccount?.alias || '' });
        setConnections(DEMO_CONNECTIONS);
        setMessageStore({});
        setProfileComplete(false);
        setCurrentScreen('landing');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, currentUser?.email]);

  // ── updateProfile: local state + Supabase upsert ──────────────────────────
  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      // Persist to Supabase
      if (SUPABASE_READY && currentUser?.id) {
        upsertProfile(currentUser.id, {
          alias:            next.alias,
          likes:            next.likes,
          dislikes:         next.dislikes,
          interests:        next.interests,
          values:           next.values,
          vibe_board:       next.vibeBoard,
          discovery_board:  next.discoveryBoard,
          red_flag_board:   next.redFlagBoard,
          green_flag_board: next.greenFlagBoard,
        }).catch(console.error);
      }
      return next;
    });
  }, [currentUser]);

  const completeProfile = useCallback(() => {
    setProfileComplete(true);
    if (SUPABASE_READY && currentUser?.id) {
      upsertProfile(currentUser.id, { profile_complete: true }).catch(console.error);
    }
  }, [currentUser]);

  // ── Board helpers ─────────────────────────────────────────────────────────
  function makeBoardAdder(key) {
    return (item) => updateProfile({ [key]: [] }); // replaced below with proper logic
  }

  const addToVibeBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.vibeBoard.find(v => v.label === item.label)) return prev;
      const next = { ...prev, vibeBoard: [...prev.vibeBoard, item] };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { vibe_board: next.vibeBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const removeFromVibeBoard = useCallback((label) => {
    setProfile(prev => {
      const next = { ...prev, vibeBoard: prev.vibeBoard.filter(v => v.label !== label) };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { vibe_board: next.vibeBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const addToBoard = addToVibeBoard;
  const removeFromBoard = removeFromVibeBoard;

  const addToDiscoveryBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.discoveryBoard.find(v => v.label === item.label)) return prev;
      const next = { ...prev, discoveryBoard: [...prev.discoveryBoard, item] };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { discovery_board: next.discoveryBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const removeFromDiscoveryBoard = useCallback((label) => {
    setProfile(prev => {
      const next = { ...prev, discoveryBoard: prev.discoveryBoard.filter(v => v.label !== label) };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { discovery_board: next.discoveryBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const addToRedFlagBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.redFlagBoard.find(v => v.label === item.label)) return prev;
      const next = { ...prev, redFlagBoard: [...prev.redFlagBoard, item] };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { red_flag_board: next.redFlagBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const removeFromRedFlagBoard = useCallback((label) => {
    setProfile(prev => {
      const next = { ...prev, redFlagBoard: prev.redFlagBoard.filter(v => v.label !== label) };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { red_flag_board: next.redFlagBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const addToGreenFlagBoard = useCallback((item) => {
    setProfile(prev => {
      if (prev.greenFlagBoard.find(v => v.label === item.label)) return prev;
      const next = { ...prev, greenFlagBoard: [...prev.greenFlagBoard, item] };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { green_flag_board: next.greenFlagBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  const removeFromGreenFlagBoard = useCallback((label) => {
    setProfile(prev => {
      const next = { ...prev, greenFlagBoard: prev.greenFlagBoard.filter(v => v.label !== label) };
      if (SUPABASE_READY && currentUser?.id)
        upsertProfile(currentUser.id, { green_flag_board: next.greenFlagBoard }).catch(console.error);
      return next;
    });
  }, [currentUser]);

  // ── Connections ───────────────────────────────────────────────────────────
  const addConnection = useCallback((user) => {
    setConnections(prev => {
      if (prev.find(c => String(c.id) === String(user.id))) return prev;
      const newConn = { ...user, connectedAt: Date.now() };
      if (SUPABASE_READY && currentUser?.id) {
        insertConnection(currentUser.id, newConn).catch(console.error);
      }
      return [newConn, ...prev];
    });
  }, [currentUser]);

  const getDaysConnected = useCallback((user) => {
    if (!user?.connectedAt) return 0;
    return Math.floor((Date.now() - user.connectedAt) / (24 * 60 * 60 * 1000));
  }, []);

  // ── Messages ──────────────────────────────────────────────────────────────
  const getMessages = useCallback((userId) => {
    return messageStore[userId] || [];
  }, [messageStore]);

  // Async loader from Supabase — call this when opening a conversation
  const loadMessages = useCallback(async (userId) => {
    if (!SUPABASE_READY || !currentUser?.id) return;
    try {
      const rows = await fetchMessages(currentUser.id, userId);
      if (rows.length > 0) {
        setMessageStore(prev => ({
          ...prev,
          [userId]: rows.map(dbRowToMessage),
        }));
      }
    } catch (e) { console.error('loadMessages:', e); }
  }, [currentUser]);

  const addMessage = useCallback((userId, msg) => {
    setMessageStore(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), msg],
    }));
    if (SUPABASE_READY && currentUser?.id) {
      insertMessage(currentUser.id, userId, msg).catch(console.error);
    }
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      activeTab, setActiveTab,
      profile, updateProfile,
      profileComplete, completeProfile,
      addToBoard, removeFromBoard,
      addToVibeBoard, removeFromVibeBoard,
      addToDiscoveryBoard, removeFromDiscoveryBoard,
      addToRedFlagBoard, removeFromRedFlagBoard,
      addToGreenFlagBoard, removeFromGreenFlagBoard,
      connections, addConnection,
      notifications, setNotifications,
      messageStore, getMessages, loadMessages, addMessage,
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
