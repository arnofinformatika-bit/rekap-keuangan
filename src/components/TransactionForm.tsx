import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Calendar, FileText, Check, Landmark, HelpCircle, Coins } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { CATEGORIES, formatRupiah } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
  isOpen,
  onClose
}) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Automatically set current date on mount
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  }, []);

  // Filter categories by selected type
  const filteredCategories = CATEGORIES.filter(cat => cat.type === type);

  // Set default category when type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const numVal = rawVal ? parseInt(rawVal, 10) : 0;
    setAmount(numVal);
    setAmountInput(numVal > 0 ? numVal.toLocaleString('id-ID') : '');
  };

  const addQuickAmount = (val: number) => {
    const newAmount = amount + val;
    setAmount(newAmount);
    setAmountInput(newAmount.toLocaleString('id-ID'));
  };

  const resetForm = () => {
    setAmount(0);
    setAmountInput('');
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
    setDescription('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setError('Jumlah uang harus lebih besar dari Rp 0');
      return;
    }
    if (!categoryId) {
      setError('Silakan pilih salah satu kategori');
      return;
    }
    if (!date) {
      setError('Silakan tentukan tanggal transaksi');
      return;
    }
    if (!description.trim()) {
      setError('Silakan isi deskripsi singkat transaksi');
      return;
    }

    onAddTransaction({
      type,
      amount,
      categoryId,
      date,
      description: description.trim()
    });

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              Tambah Transaksi Baru
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Catat aliran masuk atau keluar kas keuangan Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Type Selector Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  type === 'EXPENSE'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                🔴 Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  type === 'INCOME'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                🟢 Pemasukan
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Jumlah Uang (Rupiah)
              </label>
              {amount > 0 && (
                <span className="text-xs font-bold font-mono text-indigo-500">
                  {formatRupiah(amount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                Rp
              </span>
              <input
                type="text"
                placeholder="0"
                value={amountInput}
                onChange={handleAmountChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-slate-800 dark:text-white font-bold font-mono focus:outline-none focus:border-indigo-500 transition-colors text-lg"
              />
            </div>

            {/* Quick click buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => addQuickAmount(10000)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-300 transition-colors"
              >
                +10k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(50000)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-300 transition-colors"
              >
                +50k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(100000)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-300 transition-colors"
              >
                +100k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(500000)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-300 transition-colors"
              >
                +500k
              </button>
              <button
                type="button"
                onClick={() => addQuickAmount(1000000)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-300 transition-colors"
              >
                +1M
              </button>
              <button
                type="button"
                onClick={() => { setAmount(0); setAmountInput(''); }}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 border border-rose-100/50 dark:border-rose-900/40 rounded-lg text-[10px] font-bold text-rose-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Deskripsi / Keterangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Makan siang nasi padang"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          {/* Category Grid Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pilih Kategori
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {filteredCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-2xl flex items-center gap-2.5 transition-all text-left border ${
                      isSelected
                        ? type === 'EXPENSE'
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm'
                          : 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <span className={`p-2 rounded-xl flex-shrink-0 ${cat.bgClass}`}>
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isSelected ? 'Terpilih' : 'Pilih'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Simpan Transaksi
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionForm;
