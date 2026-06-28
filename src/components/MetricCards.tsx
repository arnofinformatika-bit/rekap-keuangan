import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Wallet, Percent } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

interface MetricCardsProps {
  totalIncome: number;
  totalExpense: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalIncome,
  totalExpense
}) => {
  const balance = totalIncome - totalExpense;
  const isPositiveBalance = balance >= 0;

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  const safeSavingsRate = savingsRate < 0 ? 0 : savingsRate > 100 ? 100 : savingsRate;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Saldo Utama Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl border border-slate-700/30"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400">Total Saldo (Net)</span>
          <div className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/50">
            <Wallet className="w-5 h-5 text-sky-400" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight font-sans">
            {formatRupiah(balance)}
          </h2>
          <div className="flex items-center gap-1.5 text-xs">
            {isPositiveBalance ? (
              <span className="flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                Surplus
              </span>
            ) : (
              <span className="flex items-center text-rose-400 font-medium bg-rose-500/10 px-2 py-0.5 rounded-full">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                Defisit
              </span>
            )}
            <span className="text-slate-400">Rasio Tabungan: {savingsRate}%</span>
          </div>
        </div>

        {/* Custom Progress Bar for Savings Rate */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Tingkat Menabung</span>
            <span className="font-semibold text-white">{safeSavingsRate}%</span>
          </div>
          <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${safeSavingsRate}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Pemasukan Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pemasukan</span>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {formatRupiah(totalIncome)}
          </h2>
          <p className="text-xs text-slate-400">
            Dari seluruh transaksi pendapatan
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Aliran Dana Masuk</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
            100% Aktif
          </span>
        </div>
      </motion.div>

      {/* Pengeluaran Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pengeluaran</span>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {formatRupiah(totalExpense)}
          </h2>
          <p className="text-xs text-slate-400">
            Dari seluruh transaksi belanja & beban
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Rasio terhadap Pemasukan</span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
            {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}%
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default MetricCards;
