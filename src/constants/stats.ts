import type { Budget, Expense, ExpenseCategory, SavingsChallenge } from '../data/types';
import { fromISODate, isSameDay, startOfDay, toISODate } from '../utils/dates';

export function sumToday(expenses: Expense[], now = new Date()): number {
  const today = startOfDay(now);
  return expenses
    .filter((e) => isSameDay(fromISODate(e.occurredAtISO), today))
    .reduce((acc, e) => acc + e.amount, 0);
}

export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function sumThisMonth(expenses: Expense[], now = new Date()): number {
  const mk = monthKey(now);
  return expenses
    .filter((e) => e.occurredAtISO.slice(0, 7) === mk)
    .reduce((acc, e) => acc + e.amount, 0);
}

export function countThisMonth(expenses: Expense[], now = new Date()): number {
  const mk = monthKey(now);
  return expenses.filter((e) => e.occurredAtISO.slice(0, 7) === mk).length;
}

export function topCategoriesThisMonth(expenses: Expense[], now = new Date()): { category: ExpenseCategory; total: number }[] {
  const mk = monthKey(now);
  const map = new Map<ExpenseCategory, number>();
  for (const e of expenses) {
    if (e.occurredAtISO.slice(0, 7) !== mk) continue;
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  const rows = Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  rows.sort((a, b) => b.total - a.total);
  return rows;
}

export function weekBars(expenses: Expense[], now = new Date()): { label: string; total: number }[] {
  const d = startOfDay(now);
  const day = d.getDay(); // 0..6
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const x = new Date(start);
    x.setDate(start.getDate() + i);
    days.push(x);
  }
  const map = new Map<string, number>();
  for (const dd of days) map.set(toISODate(dd), 0);
  for (const e of expenses) {
    if (!map.has(e.occurredAtISO)) continue;
    map.set(e.occurredAtISO, (map.get(e.occurredAtISO) ?? 0) + e.amount);
  }
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map((dd, i) => ({ label: labels[i]!, total: map.get(toISODate(dd)) ?? 0 }));
}

export function budgetSpentThisMonth(expenses: Expense[], category: ExpenseCategory, now = new Date()): number {
  const mk = monthKey(now);
  return expenses
    .filter((e) => e.category === category && e.occurredAtISO.slice(0, 7) === mk)
    .reduce((acc, e) => acc + e.amount, 0);
}

export function totalBudgetLimit(budgets: Budget[]): number {
  return budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
}

export function challengeSpent(expenses: Expense[], ch: SavingsChallenge): number {
  const start = fromISODate(ch.startISO).getTime();
  const end = fromISODate(ch.endISO).getTime();
  const cat = ch.category;
  return expenses
    .filter((e) => {
      const t = fromISODate(e.occurredAtISO).getTime();
      if (t < start || t > end) return false;
      if (cat === 'All Spending') return true;
      return e.category === cat;
    })
    .reduce((acc, e) => acc + e.amount, 0);
}

export function challengeIsActive(ch: SavingsChallenge, now = new Date()): boolean {
  const t = startOfDay(now).getTime();
  const start = fromISODate(ch.startISO).getTime();
  const end = fromISODate(ch.endISO).getTime();
  return t >= start && t <= end;
}

export function challengeIsWon(expenses: Expense[], ch: SavingsChallenge, now = new Date()): boolean {
  const t = startOfDay(now).getTime();
  const end = fromISODate(ch.endISO).getTime();
  if (t <= end) return false;
  return challengeSpent(expenses, ch) <= ch.spendingLimit;
}

