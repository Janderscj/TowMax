import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import { API_URL } from '../utils/apiConfig';

const AuthContext = createContext(null);
console.log('AuthProvider mounted');
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const loadedProfileUserIdRef = useRef(null);
  const profileRequestInFlightRef = useRef(false);

  const resetProfileState = () => {
    loadedProfileUserIdRef.current = null;
    profileRequestInFlightRef.current = false;
    setProfile(null);
    setProfileError(null);
  };

  // Fetch Profile (with timeout)
  // -----------------------------
  const fetchProfile = async (userId) => {
    if (profileRequestInFlightRef.current) {
      return false;
    }

    profileRequestInFlightRef.current = true;
    setProfileLoading(true);
    setProfileError(null);

    try {
      console.log(' Fetching profile for:', userId);

      let timeoutId;
      const profilePromise = supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Profile request timed out.')), 5000);
      });

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);
      clearTimeout(timeoutId);

      if (error) {
        throw error;
      }

      if (data) {
        loadedProfileUserIdRef.current = userId;
        setProfile(data);
        console.log(' Profile loaded:', data);
        return true;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No profile record was found for this account.');
      }

      const controller = new AbortController();
      const fetchTimeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      clearTimeout(fetchTimeoutId);

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load account details.');
      }

      loadedProfileUserIdRef.current = userId;
      setProfile(payload);
      console.log(' Profile recovered from API:', payload);
      return true;
    } catch (err) {
      console.error(' Profile fetch exception:', err);
      loadedProfileUserIdRef.current = null;
      setProfile(null);
      setProfileError(err.message || 'Unable to load account details.');
      return false;
    } finally {
      profileRequestInFlightRef.current = false;
      setProfileLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Guest Sign In
  // ─────────────────────────────────────────────────────────────────
  const signInAsGuest = () => {
    console.log(' Signing in as guest...');
    setUser({ isGuest: true });
    resetProfileState();
  };

  // ─────────────────────────────────────────────────────────────────
  // Initial Session Load
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      console.log(' Checking existing session...');

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error(' Session error:', error);
        setLoading(false);
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        if (loadedProfileUserIdRef.current !== currentUser.id) {
          await fetchProfile(currentUser.id);
        }
      } else {
        resetProfileState();
      }

      setLoading(false);
    };

    loadSession();

    // -----------------------------
    // Auth State Change Listener
    // -----------------------------
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log(' Auth state change:', event);

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        if (loadedProfileUserIdRef.current !== currentUser.id) {
          await fetchProfile(currentUser.id);
        }
      } else {
        resetProfileState();
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []); // ⭐ runs ONCE — no loops

  // -----------------------------
  // OAuth Sign-In
  // -----------------------------
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
  };

  // -----------------------------
  // Sign Out
  // -----------------------------
  const signOut = async () => {
    // Handle guest user logout
    if (user?.isGuest) {
      console.log(' Signing out guest...');
      setUser(null);
      resetProfileState();
      return;
    }

    // Handle authenticated user logout
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    resetProfileState();
  };

  // -----------------------------
  // Role Helpers
  // -----------------------------
  const isFree = profile?.role === 'free';
  const isPremium = profile?.role === 'premium';
  const isDealer = profile?.role === 'dealer';
  const isGuest = user?.isGuest === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        profileError,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        isFree,
        isPremium,
        isDealer,
        isGuest,
        refetchProfile: () => user && fetchProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
