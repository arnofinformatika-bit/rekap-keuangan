export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class, e.g., 'emerald', 'red'
  bgClass: string; // Background class, e.g., 'bg-emerald-50 text-emerald-600'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  description: string;
  createdAt: string;
}

export interface MonthlyRecap {
  month: number; // 1-12
  year: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
}

export interface FilterOptions {
  searchQuery: string;
  type: TransactionType | 'ALL';
  categoryId: string | 'ALL';
  startDate: string; // YYYY-MM-DD or empty
  endDate: string; // YYYY-MM-DD or empty
  minAmount: number | '';
  maxAmount: number | '';
}

export interface Budget {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}
