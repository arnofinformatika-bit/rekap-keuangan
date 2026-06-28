import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  ListFilter,
  Info,
  Calendar,
  DollarSign,
  Printer
} from 'lucide-react';
import { Transaction, FilterOptions, Category } from '../types';
import { CATEGORIES, formatRupiah, getCategoryById, MONTHS_ID } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  selectedMonth: number;
  selectedYear: number;
  onClearAll?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  selectedMonth,
  selectedYear,
  onClearAll
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    type: 'ALL',
    categoryId: 'ALL',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const [sortOption, setSortOption] = useState<'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('DATE_DESC');

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'ALL',
      categoryId: 'ALL',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  // 1. Filter by period (month and year)
  let filteredList = transactions.filter(t => {
    const d = new Date(t.date);
    if (isNaN(d.getTime())) return false;
    return (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
  });

  // 2. Apply secondary custom filters
  filteredList = filteredList.filter(t => {
    // Search query filter (matches description or category name)
    const categoryName = getCategoryById(t.categoryId)?.name.toLowerCase() || '';
    const matchSearch =
      t.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      categoryName.includes(filters.searchQuery.toLowerCase());

    // Type filter
    const matchType = filters.type === 'ALL' || t.type === filters.type;

    // Category filter
    const matchCategory = filters.categoryId === 'ALL' || t.categoryId === filters.categoryId;

    // Date range filter
    let matchDate = true;
    if (filters.startDate) {
      matchDate = matchDate && t.date >= filters.startDate;
    }
    if (filters.endDate) {
      matchDate = matchDate && t.date <= filters.endDate;
    }

    // Amount range filter
    let matchAmount = true;
    if (filters.minAmount !== '') {
      matchAmount = matchAmount && t.amount >= Number(filters.minAmount);
    }
    if (filters.maxAmount !== '') {
      matchAmount = matchAmount && t.amount <= Number(filters.maxAmount);
    }

    return matchSearch && matchType && matchCategory && matchDate && matchAmount;
  });

  // 3. Apply sorting
  filteredList.sort((a, b) => {
    if (sortOption === 'DATE_DESC') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortOption === 'DATE_ASC') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortOption === 'AMOUNT_DESC') {
      return b.amount - a.amount;
    }
    if (sortOption === 'AMOUNT_ASC') {
      return a.amount - b.amount;
    }
    return 0;
  });

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.type !== 'ALL' ||
    filters.categoryId !== 'ALL' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.minAmount !== '' ||
    filters.maxAmount !== '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800">
      {/* Header and Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-indigo-500" />
            Daftar Transaksi Bulanan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar seluruh pencatatan keuangan Anda pada periode terpilih
          </p>
        </div>

        {/* Search Input & Filter Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {onClearAll && transactions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin menghapus seluruh data transaksi? Tindakan ini tidak dapat dibatalkan.')) {
                  onClearAll();
                }
              }}
              className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs border border-rose-100/50 dark:border-rose-900/30 cursor-pointer"
              title="Hapus Semua Transaksi"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Data</span>
            </button>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
              showFilters || hasActiveFilters
                ? 'border-indigo-100 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 inline-block" />
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cetak Laporan Transaksi"
          >
            <Printer className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Filter Type */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Jenis Transaksi</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">Semua Aliran (In & Out)</option>
                  <option value="INCOME">Hanya Pemasukan</option>
                  <option value="EXPENSE">Hanya Pengeluaran</option>
                </select>
              </div>

              {/* Filter Category */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Kategori</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">Semua Kategori</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.type === 'INCOME' ? '🟢' : '🔴'} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Urutan</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
                >
                  <option value="DATE_DESC">Tanggal Terbaru</option>
                  <option value="DATE_ASC">Tanggal Terlama</option>
                  <option value="AMOUNT_DESC">Nominal Terbesar</option>
                  <option value="AMOUNT_ASC">Nominal Terkecil</option>
                </select>
              </div>

              {/* Amount Range */}
              <div className="space-y-1 sm:col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Min Rupiah</label>
                  <input
                    type="number"
                    placeholder="Min nominal..."
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value !== '' ? Number(e.target.value) : '' })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Max Rupiah</label>
                  <input
                    type="number"
                    placeholder="Max nominal..."
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value !== '' ? Number(e.target.value) : '' })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end justify-between sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] text-slate-400">
                  Ditemukan: <strong className="text-slate-600 dark:text-slate-200">{filteredList.length}</strong> transaksi
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Table / List Cards */}
      {filteredList.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-3">
            <Info className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {hasActiveFilters ? 'Tidak ada hasil yang cocok' : 'Belum ada transaksi di periode ini'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {hasActiveFilters
              ? 'Silakan ubah pengaturan filter Anda atau reset pencarian.'
              : 'Tambahkan catatan transaksi keuangan Anda melalui tombol "Tambah Transaksi" di atas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredList.map((item, index) => {
              const category = getCategoryById(item.categoryId);
              const isIncome = item.type === 'INCOME';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl group transition-all"
                >
                  {/* Left Info: Icon & Text */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`p-3 rounded-2xl flex-shrink-0 ${category?.bgClass || 'bg-slate-100 text-slate-600'}`}>
                      <CategoryIcon name={category?.icon || 'HelpCircle'} className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                          {category?.name || 'Umum'}
                        </span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Info: Amount & Actions */}
                  <div className="flex items-center gap-3">
                    <span className={`font-bold font-mono text-xs sm:text-sm text-right ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isIncome ? '+' : '-'} {formatRupiah(item.amount)}
                    </span>

                    <button
                      onClick={() => onDeleteTransaction(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* PRINT-ONLY REPORT ELEMENT */}
      <div className="hidden print-only print-content">
        <div className="print-header">
          <h1 className="text-xl font-bold text-slate-900">LAPORAN REKAPITULASI KEUANGAN</h1>
          <p className="text-xs text-slate-500">Aplikasi Pembukuan Kas Pribadi FinTrack</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p><strong>Periode Laporan:</strong> {selectedMonth ? `${MONTHS_ID[selectedMonth - 1]} ${selectedYear}` : 'Semua Periode'}</p>
              <p><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right col-start-2">
              <p><strong>Total Pemasukan:</strong> {formatRupiah(filteredList.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0))}</p>
              <p><strong>Total Pengeluaran:</strong> {formatRupiah(filteredList.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0))}</p>
              <p><strong>Sisa Saldo:</strong> {formatRupiah(filteredList.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0) - filteredList.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0))}</p>
            </div>
          </div>
        </div>

        <table className="print-table w-full">
          <thead>
            <tr>
              <th className="w-12 text-center">No</th>
              <th className="w-24">Tanggal</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th className="w-24 text-right">Aliran</th>
              <th className="w-32 text-right">Jumlah (Rupiah)</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item, idx) => {
              const category = getCategoryById(item.categoryId);
              return (
                <tr key={item.id}>
                  <td className="text-center font-mono">{idx + 1}</td>
                  <td className="font-mono">{item.date}</td>
                  <td>{category?.name || 'Umum'}</td>
                  <td>{item.description}</td>
                  <td className="text-right font-bold text-xs">
                    <span className="print-badge">
                      {item.type === 'INCOME' ? 'PEMASUKAN' : 'PENGELUARAN'}
                    </span>
                  </td>
                  <td className="text-right font-bold font-mono">
                    {item.type === 'INCOME' ? '+' : '-'} {formatRupiah(item.amount)}
                  </td>
                </tr>
              );
            })}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-400">
                  Tidak ada catatan transaksi pada periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="mt-8 text-[10px] text-slate-400 text-center border-t border-slate-200 pt-4">
          Dicetak secara otomatis melalui Sistem Keuangan FinTrack. Hak Cipta dilindungi Undang-Undang.
        </div>
      </div>

    </div>
  );
};

export default TransactionList;
