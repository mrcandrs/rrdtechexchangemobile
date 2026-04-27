import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AppData, Budget, Expense, SavingsChallenge } from './types';
import { createBudget, createChallenge, createExpense, loadData, saveData } from './store';
import { useAuth } from '../auth/AuthContext';
import { pullAllFromSupabase, pushAllToSupabase } from '../sync/supabaseSync';

type DataContextValue = {
  data: AppData;
  isHydrated: boolean;
  isSyncing: boolean;
  lastSyncError: string | null;
  syncNow: () => Promise<void>;
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id' | 'createdAt'>) => Promise<void>;
  updateBudget: (b: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addChallenge: (c: Omit<SavingsChallenge, 'id' | 'createdAt'>) => Promise<void>;
  deleteChallenge: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

const emptyData: AppData = { expenses: [], budgets: [], challenges: [] };

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<AppData>(emptyData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const d = await loadData();
      if (!mounted) return;
      setData(d);
      setIsHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const syncNow = async () => {
    const userId = user?.id;
    if (!userId) return;
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      // Pull first (to support first-login on a new device), then push local state
      const remote = await pullAllFromSupabase(userId);
      const merged: AppData = {
        expenses: mergeById(data.expenses, remote.expenses),
        budgets: mergeById(data.budgets, remote.budgets),
        challenges: mergeById(data.challenges, remote.challenges),
      };
      setData(merged);
      await saveData(merged);
      await pushAllToSupabase(userId, merged);
    } catch (e) {
      setLastSyncError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  // When user logs in, do an initial sync.
  useEffect(() => {
    if (!isHydrated) return;
    if (!user?.id) return;
    void syncNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, user?.id]);

  const queueSync = () => {
    if (!user?.id) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void syncNow();
    }, 800);
  };

  const api = useMemo<DataContextValue>(() => {
    const commit = async (next: AppData) => {
      setData(next);
      await saveData(next);
      queueSync();
    };

    return {
      data,
      isHydrated,
      isSyncing,
      lastSyncError,
      syncNow,
      addExpense: async (e) => {
        const exp = createExpense(e);
        await commit({ ...data, expenses: [exp, ...data.expenses] });
      },
      deleteExpense: async (id) => {
        await commit({ ...data, expenses: data.expenses.filter((x) => x.id !== id) });
      },
      addBudget: async (b) => {
        const bud = createBudget(b);
        const others = data.budgets.filter((x) => x.category !== bud.category);
        await commit({ ...data, budgets: [bud, ...others] });
      },
      updateBudget: async (b) => {
        await commit({ ...data, budgets: data.budgets.map((x) => (x.id === b.id ? b : x)) });
      },
      deleteBudget: async (id) => {
        await commit({ ...data, budgets: data.budgets.filter((x) => x.id !== id) });
      },
      addChallenge: async (c) => {
        const ch = createChallenge(c);
        await commit({ ...data, challenges: [ch, ...data.challenges] });
      },
      deleteChallenge: async (id) => {
        await commit({ ...data, challenges: data.challenges.filter((x) => x.id !== id) });
      },
    };
  }, [data, isHydrated, isSyncing, lastSyncError, user?.id]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

function mergeById<T extends { id: string; createdAt: number }>(local: T[], remote: T[]): T[] {
  const map = new Map<string, T>();
  for (const x of remote) map.set(x.id, x);
  for (const x of local) {
    const existing = map.get(x.id);
    if (!existing || x.createdAt >= existing.createdAt) map.set(x.id, x);
  }
  const out = Array.from(map.values());
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

