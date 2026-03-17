import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

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

  // ⭐ useRef guard — does NOT trigger re-renders, does NOT loop
  const profileRequestedRef = useRef(false);

  // -----------------------------
  // Fetch Profile (with timeout)
  // -----------------------------
  const fetchProfile = async (userId) => {
    setProfileLoading(true);

    try {
      console.log('👤 Fetching profile for:', userId);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      clearTimeout(timeout);

      if (error) {
        console.error('❌ Profile fetch error:', error);
        setProfile(null);
        return;
      }

      setProfile(data);
      console.log('👤 Profile loaded:', data);
    } catch (err) {
      console.error('❌ Profile fetch exception:', err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // -----------------------------
  // Initial Session Load
  // -----------------------------
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      console.log('🔐 Checking existing session...');

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('❌ Session error:', error);
        setLoading(false);
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser && !profileRequestedRef.current) {
        profileRequestedRef.current = true; // ⭐ guard set immediately
        await fetchProfile(currentUser.id);
      }

      setLoading(false);
    };

    loadSession();

    // -----------------------------
    // Auth State Change Listener
    // -----------------------------
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔐 Auth state change:', event);

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        if (!profileRequestedRef.current) {
          profileRequestedRef.current = true; // ⭐ guard prevents repeats
          await fetchProfile(currentUser.id);
        }
      } else {
        // User signed out
        profileRequestedRef.current = false;
        setProfile(null);
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    profileRequestedRef.current = false;
    setProfile(null);
  };

  // -----------------------------
  // Role Helpers
  // -----------------------------
  const isFree = profile?.role === 'free';
  const isPremium = profile?.role === 'premium';
  const isDealer = profile?.role === 'dealer';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        signInWithGoogle,
        signOut,
        isFree,
        isPremium,
        isDealer,
        refetchProfile: () => user && fetchProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
