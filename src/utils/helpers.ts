import { Category, Transaction } from '../types';

export const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export const CATEGORIES: Category[] = [
  // Income
  { id: 'inc-gaji', name: 'Gaji & Pendapatan', type: 'INCOME', icon: 'Briefcase', color: 'emerald', bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' },
  { id: 'inc-investasi', name: 'Investasi', type: 'INCOME', icon: 'TrendingUp', color: 'cyan', bgClass: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50' },
  { id: 'inc-bonus', name: 'Bonus & Sampingan', type: 'INCOME', icon: 'Award', color: 'amber', bgClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50' },
  { id: 'inc-penjualan', name: 'Penjualan Sampingan', type: 'INCOME', icon: 'ShoppingBag', color: 'blue', bgClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' },
  { id: 'inc-tabungan', name: 'Pencairan Tabungan', type: 'INCOME', icon: 'PiggyBank', color: 'teal', bgClass: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50' },
  { id: 'inc-lain', name: 'Pendapatan Lain', type: 'INCOME', icon: 'Coins', color: 'slate', bgClass: 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400 border border-slate-100 dark:border-slate-800/50' },

  // Expense
  { id: 'exp-makanan', name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'Utensils', color: 'rose', bgClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50' },
  { id: 'exp-transport', name: 'Transportasi', type: 'EXPENSE', icon: 'Car', color: 'indigo', bgClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50' },
  { id: 'exp-belanja', name: 'Belanja & Lifestyle', type: 'EXPENSE', icon: 'ShoppingCart', color: 'pink', bgClass: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border border-pink-100 dark:border-pink-900/50' },
  { id: 'exp-hiburan', name: 'Hiburan & Hobi', type: 'EXPENSE', icon: 'Tv', color: 'violet', bgClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50' },
  { id: 'exp-tagihan', name: 'Tagihan & Utilitas', type: 'EXPENSE', icon: 'Receipt', color: 'amber', bgClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50' },
  { id: 'exp-kesehatan', name: 'Kesehatan', type: 'EXPENSE', icon: 'HeartPulse', color: 'red', bgClass: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50' },
  { id: 'exp-pendidikan', name: 'Pendidikan', type: 'EXPENSE', icon: 'GraduationCap', color: 'sky', bgClass: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50' },
  { id: 'exp-tabungan', name: 'Tabungan & Simpanan', type: 'EXPENSE', icon: 'PiggyBank', color: 'emerald', bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' },
  { id: 'exp-lain', name: 'Pengeluaran Lain', type: 'EXPENSE', icon: 'HelpCircle', color: 'slate', bgClass: 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400 border border-slate-100 dark:border-slate-800/50' },
];

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

// Helper to generate elegant mock data relative to the current year/month
export function generateMockTransactions(): Transaction[] {
  // Return empty array so user starts with a clean slate/zero balance
  return [];
}

export function getMonthYearOptions(transactions: Transaction[]) {
  const options: { month: number; year: number; label: string }[] = [];
  
  // Add all 12 months of the current year by default
  const now = new Date();
  const currentYear = now.getFullYear();
  
  for (let m = 1; m <= 12; m++) {
    options.push({
      month: m,
      year: currentYear,
      label: `${MONTHS_ID[m - 1]} ${currentYear}`
    });
  }

  // Add other months/years from existing transactions if not already included
  transactions.forEach(t => {
    const d = new Date(t.date);
    if (!isNaN(d.getTime())) {
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const label = `${MONTHS_ID[m - 1]} ${y}`;
      if (!options.some(opt => opt.month === m && opt.year === y)) {
        options.push({ month: m, year: y, label });
      }
    }
  });

  // Sort by year desc, then month desc
  return options.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}
