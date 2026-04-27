import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { type AppRole, validateEmailAccess } from './accessControl';

type AuthValue = {
  isHydrated: boolean;
  session: Session | null;
  user: User | null;
  role: AppRole;
  canInputExpenses: boolean;
  canModifyAll: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signUp: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  resetPassword: (email: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setIsHydrated(true);
      })
      .catch(() => {
        if (!mounted) return;
        setIsHydrated(true);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) {
      setRole(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const access = await validateEmailAccess(email);
      if (cancelled) return;
      if (!access.ok) {
        setRole(null);
        await supabase.auth.signOut();
        return;
      }
      setRole(access.role);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.email]);

  const value = useMemo<AuthValue>(() => {
    return {
      isHydrated,
      session,
      user: session?.user ?? null,
      role,
      canInputExpenses: role === 'main_admin' || role === 'member',
      canModifyAll: role === 'main_admin',
      signIn: async (email, password) => {
        const access = await validateEmailAccess(email);
        if (!access.ok) return access;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, message: error.message };
        setRole(access.role);
        return { ok: true };
      },
      signUp: async (email, password) => {
        const access = await validateEmailAccess(email);
        if (!access.ok) return access;
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return { ok: false, message: error.message };
        setRole(access.role);
        return { ok: true };
      },
      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { ok: false, message: error.message };
        return { ok: true };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    };
  }, [isHydrated, role, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

