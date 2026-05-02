import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const ACCOUNTS_KEY = 'friendus_accounts';
const SESSION_KEY  = 'friendus_session';

function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
  catch { return {}; }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadSession() {
  return localStorage.getItem(SESSION_KEY) || null;
}

export function AuthProvider({ children }) {
  const [accounts, setAccounts]         = useState(loadAccounts);
  const [currentEmail, setCurrentEmail] = useState(loadSession);

  const currentAccount = currentEmail ? accounts[currentEmail] : null;

  // Sign Up — returns { ok, error }
  const signUp = useCallback((email, password, alias) => {
    const norm = email.trim().toLowerCase();
    if (!norm || !password || !alias.trim()) return { ok: false, error: 'All fields are required.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) return { ok: false, error: 'Enter a valid email.' };
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

    const existing = loadAccounts();
    if (existing[norm]) return { ok: false, error: 'An account with this email already exists.' };

    const newAccount = {
      email: norm,
      passwordHash: btoa(password), // simple obfuscation (not cryptographic)
      alias: alias.trim(),
      createdAt: Date.now(),
      data: null, // will hold saved app state
    };

    const updated = { ...existing, [norm]: newAccount };
    saveAccounts(updated);
    setAccounts(updated);
    localStorage.setItem(SESSION_KEY, norm);
    setCurrentEmail(norm);
    return { ok: true };
  }, []);

  // Sign In — returns { ok, error }
  const signIn = useCallback((email, password) => {
    const norm = email.trim().toLowerCase();
    const existing = loadAccounts();
    const acct = existing[norm];
    if (!acct) return { ok: false, error: 'No account found with that email.' };
    if (acct.passwordHash !== btoa(password)) return { ok: false, error: 'Incorrect password.' };

    localStorage.setItem(SESSION_KEY, norm);
    setCurrentEmail(norm);
    setAccounts(existing);
    return { ok: true };
  }, []);

  // Sign Out
  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentEmail(null);
  }, []);

  // Save app state for current user
  const saveAppData = useCallback((data) => {
    if (!currentEmail) return;
    const existing = loadAccounts();
    if (!existing[currentEmail]) return;
    const updated = {
      ...existing,
      [currentEmail]: { ...existing[currentEmail], data },
    };
    saveAccounts(updated);
    setAccounts(updated);
  }, [currentEmail]);

  // Load saved app data for current user
  const loadAppData = useCallback(() => {
    if (!currentEmail) return null;
    const existing = loadAccounts();
    return existing[currentEmail]?.data || null;
  }, [currentEmail]);

  return (
    <AuthContext.Provider value={{
      currentAccount,
      currentEmail,
      signUp,
      signIn,
      signOut,
      saveAppData,
      loadAppData,
      isLoggedIn: !!currentAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
