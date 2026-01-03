'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthContextValue {
  session: Session | null;
  isAdmin: boolean;
  signIn: (email: string, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function checkAdminStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
  return data === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateAdminStatus = async (session: Session | null) => {
    if (session?.user?.id) {
      const adminStatus = await checkAdminStatus(session.user.id);
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check if we have auth tokens in URL (from magic link callback)
    const handleAuthCallback = async () => {
      // Check for token in URL params (from our callback route) OR hash fragment (direct Supabase redirect)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = urlParams.get('token') || hashParams.get('access_token');
        const type = urlParams.get('type') || hashParams.get('type');

        if (token && (type === 'magiclink' || hashParams.has('access_token'))) {
          // If we have tokens in hash fragment, Supabase has already established the session
          // Clean up hash fragment from URL
          if (hashParams.has('access_token')) {
            window.history.replaceState({}, '', window.location.pathname + window.location.search);
            return; // Session already established, skip OTP verification
          }
          
          // Verify the token and establish session (for query param tokens from our callback route)
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'magiclink',
          });

          if (data?.session) {
            // Clean up URL params but preserve edit and jamId params if present
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('token');
            newUrl.searchParams.delete('type');
            // Keep 'edit' and 'jamId' params - they're needed for the page
            window.history.replaceState({}, '', newUrl.toString());
          } else if (error) {
            console.error('[AuthProvider] Error verifying OTP in client:', error);
          }
        }
      }
    };

    // Get initial session
    const initializeAuth = async () => {
      await handleAuthCallback();
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await updateAdminStatus(session);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      await updateAdminStatus(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value: AuthContextValue = {
    session,
    isAdmin,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

