export type ExpenseCategory = 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Shopping' | 'Travel' | 'Other';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Digital Wallet';

export type Period = 'Weekly' | 'Monthly';

export type ChallengeCategory = ExpenseCategory | 'All Spending';

export type Expense = {
  id: string;
  title: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  amount: number; // positive number
  occurredAtISO: string; // YYYY-MM-DD
  createdAt: number;
};

export type Budget = {
  id: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  createdAt: number;
};

export type SavingsChallenge = {
  id: string;
  title: string;
  spendingLimit: number;
  category: ChallengeCategory;
  period: Period;
  startISO: string; // YYYY-MM-DD
  endISO: string; // YYYY-MM-DD
  createdAt: number;
};

export type AppData = {
  expenses: Expense[];
  budgets: Budget[];
  challenges: SavingsChallenge[];
};

