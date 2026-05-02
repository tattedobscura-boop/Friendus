import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, fetchProfile, upsertProfile } from '../lib/supabase';

const AuthContext = createContext(null);

// ─── Detect whether Supabase is actually configured ────────────────────────
const SUPABASE_READY =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project-id');

// ─── Offline/demo fallback (localStorage) — used when keys aren't set ──────
const ACCOUNTS_KEY = 'friendus_accounts';
const SESSION_KEY  = 'friendus_session';

function ls_loadAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
  catch { return {}; }
}
function ls_saveAccounts(a) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a)); }
function ls_loadSession()   { return localStorage.getItem(SESSION_KEY) || null; }

// ─── Map Supabase error codes to friendly messages ─────────────────────────
function supabaseErrMsg(err) {
  if (!err) return 'Something went wrong.';
  const msg = err.message || '';
  if (msg.includes('Invalid login credentials'))   return 'Incorrect email or password.';
  if (msg.includes('Email not confirmed'))         return 'Please confirm your email first.';
  if (msg.includes('User already registered'))     return 'An account with this email already exists.';
  if (msg.includes('Password should be'))         return 'Password must be at least 6 characters.';
  if (msg.includes('Unable to validate'))         return 'Connection error — check your internet and try again.';
  return msg || 'Something went wrong.';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);  // Supabase user object or ls account
  const [profile, setProfile]           = useState(null);  // profiles table row
  const [loading, setLoading]           = useState(true);  // initial session check

  // ── Supabase mode: listen to auth state changes ──────────────────────────
  useEffect(() => {
    if (!SUPABASE_READY) {
      // offline mode — restore from localStorage
      const email = ls_loadSession();
      if (email) {
        const accts = ls_loadAccounts();
        if (accts[email]) setCurrentUser({ email, ...accts[email], _offline: true });
      }
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) loadSupabaseProfile(session.user.id);
      setLoading(false);
    });

    // Listen for sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          await loadSupabaseProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function loadSupabaseProfile(userId) {
    const row = await fetchProfile(userId);
    setProfile(row);
  }

  // ── Check for Stripe redirect (?upgraded=1) ───────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1' && currentUser && !currentUser._offline) {
      // Mark as premium in Supabase
      upsertProfile(currentUser.id, { subscription_status: 'premium' }).then(() => {
        setProfile(p => p ? { ...p, subscription_status: 'premium' } : p);
        // Clean the URL
        window.history.replaceState({}, '', window.location.pathname);
      }).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // ── signUp ────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (email, password, alias) => {
    const norm = email.trim().toLowerCase();
    if (!norm || !password || !alias.trim()) return { ok: false, error: 'All fields are required.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) return { ok: false, error: 'Enter a valid email.' };
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

    if (!SUPABASE_READY) {
      // Offline fallback
      const accts = ls_loadAccounts();
      if (accts[norm]) return { ok: false, error: 'An account with this email already exists.' };
      const acct = { email: norm, passwordHash: btoa(password), alias: alias.trim(), createdAt: Date.now() };
      ls_saveAccounts({ ...accts, [norm]: acct });
      localStorage.setItem(SESSION_KEY, norm);
      setCurrentUser({ email: norm, ...acct, _offline: true });
      return { ok: true };
    }

    const { data, error } = await supabase.auth.signUp({ email: norm, password });
    if (error) return { ok: false, error: supabaseErrMsg(error) };

    // Create the profile row immediately
    if (data.user) {
      try {
        await upsertProfile(data.user.id, {
          alias: alias.trim(),
          subscription_status: 'free',
          profile_complete: false,
        });
        setProfile({ id: data.user.id, alias: alias.trim(), subscription_status: 'free', profile_complete: false });
      } catch (e) { console.error('Profile create error:', e); }
    }
    return { ok: true };
  }, []);

  // ── signIn ────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    const norm = email.trim().toLowerCase();

    if (!SUPABASE_READY) {
      const accts = ls_loadAccounts();
      const acct = accts[norm];
      if (!acct) return { ok: false, error: 'No account found with that email.' };
      if (acct.passwordHash !== btoa(password)) return { ok: false, error: 'Incorrect password.' };
      localStorage.setItem(SESSION_KEY, norm);
      setCurrentUser({ email: norm, ...acct, _offline: true });
      return { ok: true };
    }

    const { error } = await supabase.auth.signInWithPassword({ email: norm, password });
    if (error) return { ok: false, error: supabaseErrMsg(error) };
    return { ok: true };
  }, []);

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (!SUPABASE_READY) {
      localStorage.removeItem(SESSION_KEY);
      setCurrentUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setCurrentUser(null);
    setProfile(null);
  }, []);

  // ── upgradeOffline (demo only — just flips the flag) ──────────────────────
  const upgradeToPremium = useCallback(async () => {
    if (!currentUser) return;
    if (!SUPABASE_READY) {
      setProfile(p => ({ ...(p || {}), subscription_status: 'premium' }));
      return;
    }
    await upsertProfile(currentUser.id, { subscription_status: 'premium' });
    setProfile(p => p ? { ...p, subscription_status: 'premium' } : p);
  }, [currentUser]);

  // ── Derived values ────────────────────────────────────────────────────────
  const isLoggedIn  = !!currentUser;
  const isPremium   = profile?.subscription_status === 'premium';
  const currentAlias = profile?.alias || currentUser?.user_metadata?.alias || currentUser?.alias || '';
  const currentEmail = currentUser?.email || '';

  // Shape that rest of the app expects as "currentAccount"
  const currentAccount = currentUser
    ? { email: currentEmail, alias: currentAlias, subscription_status: profile?.subscription_status || 'free' }
    : null;

  // ── Offline data helpers (still used by AppContext when offline) ───────────
  const saveAppData = useCallback((data) => {
    if (!currentEmail) return;
    const accts = ls_loadAccounts();
    ls_saveAccounts({ ...accts, [currentEmail]: { ...accts[currentEmail], data } });
  }, [currentEmail]);

  const loadAppData = useCallback(() => {
    if (!currentEmail) return null;
    return ls_loadAccounts()[currentEmail]?.data || null;
  }, [currentEmail]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentAccount,
      currentEmail,
      profile,          // full Supabase profile row
      isLoggedIn,
      isPremium,
      loading,
      signUp,
      signIn,
      signOut,
      upgradeToPremium,
      saveAppData,
      loadAppData,
      supabaseReady: SUPABASE_READY,
      refreshProfile: () => currentUser && !currentUser._offline
        ? loadSupabaseProfile(currentUser.id)
        : Promise.resolve(),
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
