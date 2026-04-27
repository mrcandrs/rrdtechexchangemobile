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
  const { user, canInputExpenses, canModifyAll } = useAuth();
  const [data, setData] = useState<AppData>(emptyData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef<AppData>(emptyData);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const d = await loadData();
      if (!mounted) return;
      dataRef.current = d;
      setData(d);
      setIsHydrated(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const syncNow = async (opts?: { pullFirst?: boolean }) => {
    const userId = user?.id;
    if (!userId) return;
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      let next = dataRef.current;

      if (opts?.pullFirst) {
        const remote = await pullAllFromSupabase(userId);
        const local = dataRef.current;
        const localHasAny = local.expenses.length > 0 || local.budgets.length > 0 || local.challenges.length > 0;
        const remoteHasAny = remote.expenses.length > 0 || remote.budgets.length > 0 || remote.challenges.length > 0;

        // If local is empty, hydrate from remote.
        if (!localHasAny && remoteHasAny) {
          next = remote;
        }
        // If remote was manually cleared, clear local too.
        if (localHasAny && !remoteHasAny) {
          next = remote;
        }
      }

      dataRef.current = next;
      setData(next);
      await saveData(next);
      await pushAllToSupabase(userId, next);
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
    void syncNow({ pullFirst: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, user?.id]);

  const queueSync = () => {
    if (!user?.id) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void syncNow({ pullFirst: false });
    }, 800);
  };

  const api = useMemo<DataContextValue>(() => {
    const commit = async (next: AppData) => {
      dataRef.current = next;
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
        if (!canInputExpenses) throw new Error('Only authorized users can add expenses.');
        const exp = createExpense(e);
        await commit({ ...data, expenses: [exp, ...data.expenses] });
      },
      deleteExpense: async (id) => {
        if (!canModifyAll) throw new Error('Only the main admin can modify expenses.');
        await commit({ ...data, expenses: data.expenses.filter((x) => x.id !== id) });
      },
      addBudget: async (b) => {
        if (!canModifyAll) throw new Error('Only the main admin can manage budgets.');
        const bud = createBudget(b);
        const others = data.budgets.filter((x) => x.category !== bud.category);
        await commit({ ...data, budgets: [bud, ...others] });
      },
      updateBudget: async (b) => {
        if (!canModifyAll) throw new Error('Only the main admin can manage budgets.');
        await commit({ ...data, budgets: data.budgets.map((x) => (x.id === b.id ? b : x)) });
      },
      deleteBudget: async (id) => {
        if (!canModifyAll) throw new Error('Only the main admin can manage budgets.');
        await commit({ ...data, budgets: data.budgets.filter((x) => x.id !== id) });
      },
      addChallenge: async (c) => {
        if (!canModifyAll) throw new Error('Only the main admin can manage challenges.');
        const ch = createChallenge(c);
        await commit({ ...data, challenges: [ch, ...data.challenges] });
      },
      deleteChallenge: async (id) => {
        if (!canModifyAll) throw new Error('Only the main admin can manage challenges.');
        await commit({ ...data, challenges: data.challenges.filter((x) => x.id !== id) });
      },
    };
  }, [canInputExpenses, canModifyAll, data, isHydrated, isSyncing, lastSyncError, user?.id]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

