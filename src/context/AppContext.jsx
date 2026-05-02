import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, onboarding, app
  const [activeTab, setActiveTab] = useState('discover');
  const [profile, setProfile] = useState({
    alias: '',
    likes: [],
    dislikes: [],
    interests: [],
    visionBoard: [],
  });
  const [connections, setConnections] = useState([]);
  const [notifications, setNotifications] = useState(3);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addToBoard = (item) => {
    setProfile(prev => {
      if (prev.visionBoard.find(v => v.label === item.label)) return prev;
      return { ...prev, visionBoard: [...prev.visionBoard, item] };
    });
  };

  const removeFromBoard = (label) => {
    setProfile(prev => ({
      ...prev,
      visionBoard: prev.visionBoard.filter(v => v.label !== label),
    }));
  };

  const addConnection = (user) => {
    setConnections(prev => {
      if (prev.find(c => c.id === user.id)) return prev;
      return [user, ...prev];
    });
  };

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      activeTab, setActiveTab,
      profile, updateProfile,
      addToBoard, removeFromBoard,
      connections, addConnection,
      notifications, setNotifications,
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
