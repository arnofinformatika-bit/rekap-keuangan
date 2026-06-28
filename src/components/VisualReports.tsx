import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, BarChart3, TrendingUp, TrendingDown, Info, Calendar } from 'lucide-react';
import { Transaction, Category } from '../types';
import { CATEGORIES, formatRupiah } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

interface VisualReportsProps {
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
}

export const VisualReports: React.FC<VisualReportsProps> = ({
  transactions,
  selectedMonth,
  selectedYear
}) => {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  // Filter transactions based on selected month and year
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return !isNaN(d.getTime()) && (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
  });

  const incomeTransactions = monthlyTransactions.filter(t => t.type === 'INCOME');
  const expenseTransactions = monthlyTransactions.filter(t => t.type === 'EXPENSE');

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  const currentTypeTransactions = activeTab === 'EXPENSE' ? expenseTransactions : incomeTransactions;
  const currentTotal = activeTab === 'EXPENSE' ? totalExpense : totalIncome;

  // Group by category
  const categoryTotals: Record<string, number> = {};
  currentTypeTransactions.forEach(t => {
    categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
  });

  // Convert to array and sort by amount descending
  const categoryData = Object.entries(categoryTotals)
    .map(([categoryId, amount]) => {
      const category = CATEGORIES.find(c => c.id === categoryId);
      return {
        categoryId,
        category,
        amount,
        percentage: currentTotal > 0 ? Math.round((amount / currentTotal) * 100) : 0
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // SVG Donut Chart Calculation
  let cumulativePercent = 0;
  const donutSegments = categoryData.map((data) => {
    const startPercent = cumulativePercent;
    cumulativePercent += data.percentage;
    return {
      ...data,
      startPercent,
      endPercent: cumulativePercent
    };
  });

  // Calculate coordinates for SVG path representing circles / rings
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" />
            Analisis Keuangan Bulanan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Grafik pembagian & rasio keuangan untuk periode ini
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('EXPENSE')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'EXPENSE'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Pengeluaran
          </button>
          <button
            onClick={() => setActiveTab('INCOME')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'INCOME'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Pemasukan
          </button>
        </div>
      </div>

      {monthlyTransactions.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-3">
            <Info className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Belum ada transaksi di bulan ini
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
            Silakan tambahkan data transaksi baru untuk melihat laporan visual yang komprehensif.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Donut / Pie Representation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {currentTotal === 0 ? (
              <div className="h-56 w-56 rounded-full border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center p-4">
                <span className="text-xs text-slate-400">Tidak ada transaksi bertipe {activeTab === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}</span>
              </div>
            ) : (
              <div className="relative w-56 h-56">
                {/* SVG Semi-Donut Circle */}
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="4"
                    className="dark:stroke-slate-800"
                  />
                  
                  {/* Dynamic Ring Slices */}
                  {(() => {
                    let runningOffset = 0;
                    return donutSegments.map((segment, index) => {
                      const strokeDasharray = `${segment.percentage} ${100 - segment.percentage}`;
                      const strokeDashoffset = 100 - runningOffset + 25; // standard offset start from top
                      runningOffset += segment.percentage;

                      // Map category color to a hex or standard Tailwind border style
                      let strokeColor = '#94a3b8'; // default slate-400
                      if (segment.category) {
                        const col = segment.category.color;
                        if (col === 'emerald') strokeColor = '#10b981';
                        else if (col === 'cyan') strokeColor = '#06b6d4';
                        else if (col === 'amber') strokeColor = '#f59e0b';
                        else if (col === 'blue') strokeColor = '#3b82f6';
                        else if (col === 'rose') strokeColor = '#f43f5e';
                        else if (col === 'indigo') strokeColor = '#6366f1';
                        else if (col === 'pink') strokeColor = '#ec4899';
                        else if (col === 'violet') strokeColor = '#8b5cf6';
                        else if (col === 'red') strokeColor = '#ef4444';
                        else if (col === 'sky') strokeColor = '#0ea5e9';
                      }

                      return (
                        <circle
                          key={segment.categoryId}
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke={strokeColor}
                          strokeWidth="4.2"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500 hover:stroke-[5px]"
                          style={{ transitionDelay: `${index * 50}ms` }}
                        />
                      );
                    });
                  })()}
                </svg>

                {/* Inner Text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    {activeTab === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-white mt-0.5 truncate max-w-[150px]">
                    {formatRupiah(currentTotal)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {currentTypeTransactions.length} Transaksi
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* List and breakdown bars */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rincian Kategori
            </h4>

            {categoryData.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Belum ada rincian kategori untuk tipe ini.
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                {categoryData.map((data, index) => {
                  const categoryColor = data.category?.color || 'slate';
                  
                  // Color maps for dynamic Tailwind progress bar classes
                  const progressColorMap: Record<string, string> = {
                    emerald: 'bg-emerald-500',
                    cyan: 'bg-cyan-500',
                    amber: 'bg-amber-500',
                    blue: 'bg-blue-500',
                    rose: 'bg-rose-500',
                    indigo: 'bg-indigo-500',
                    pink: 'bg-pink-500',
                    violet: 'bg-violet-500',
                    red: 'bg-red-500',
                    sky: 'bg-sky-500',
                    slate: 'bg-slate-500'
                  };

                  return (
                    <motion.div
                      key={data.categoryId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${data.category?.bgClass || 'bg-slate-100 text-slate-600'}`}>
                            <CategoryIcon name={data.category?.icon || 'HelpCircle'} className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {data.category?.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({data.percentage}%)
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {formatRupiah(data.amount)}
                        </span>
                      </div>

                      {/* Progress meter */}
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className={`h-full rounded-full ${progressColorMap[categoryColor] || 'bg-slate-500'}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Cashflow Ratio Quick Recap */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <span>Rasio Arus Kas Bulan Ini</span>
                <span>Pemasukan vs Pengeluaran</span>
              </div>
              <div className="w-full h-3 bg-rose-200 dark:bg-rose-950/40 rounded-full overflow-hidden flex">
                {totalIncome + totalExpense > 0 ? (
                  <>
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${(totalIncome / (totalIncome + totalExpense)) * 100}%` }}
                      title={`Pemasukan: ${Math.round((totalIncome / (totalIncome + totalExpense)) * 100)}%`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${(totalExpense / (totalIncome + totalExpense)) * 100}%` }}
                      title={`Pengeluaran: ${Math.round((totalExpense / (totalIncome + totalExpense)) * 100)}%`}
                    />
                  </>
                ) : (
                  <div className="bg-slate-200 dark:bg-slate-800 w-full h-full" />
                )}
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Masuk: {totalIncome + totalExpense > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 0}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Keluar: {totalIncome + totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualReports;
