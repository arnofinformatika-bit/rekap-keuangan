import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Coins,
  Calendar,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  CalendarDays,
  FileSpreadsheet,
  LayoutDashboard,
  PieChart,
  ListCollapse,
  Database,
  Menu,
  X,
  Target,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  LogIn,
  User,
  Lock
} from 'lucide-react';
import { Transaction } from './types';
import {
  generateMockTransactions,
  getMonthYearOptions,
  MONTHS_ID,
  formatRupiah
} from './utils/helpers';
import MetricCards from './components/MetricCards';
import VisualReports from './components/VisualReports';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import LoginOnboard from './components/LoginOnboard';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'reports' | 'transactions'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('rekap_keuangan_is_logged_in') !== 'false';
  });
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('rekap_keuangan_username') || 'Arno';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('rekap_keuangan_user_email') || 'arnofinformatika@gmail.com';
  });

  const handleLogin = (name: string, email: string) => {
    setUsername(name || 'Arno');
    setUserEmail(email || 'arnofinformatika@gmail.com');
    setIsLoggedIn(true);
    localStorage.setItem('rekap_keuangan_username', name || 'Arno');
    localStorage.setItem('rekap_keuangan_user_email', email || 'arnofinformatika@gmail.com');
    localStorage.setItem('rekap_keuangan_is_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('rekap_keuangan_is_logged_in', 'false');
  };

  // Initialize and load transactions
  useEffect(() => {
    const saved = localStorage.getItem('rekap_keuangan_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        const mock = generateMockTransactions();
        setTransactions(mock);
        localStorage.setItem('rekap_keuangan_transactions', JSON.stringify(mock));
      }
    } else {
      const mock = generateMockTransactions();
      setTransactions(mock);
      localStorage.setItem('rekap_keuangan_transactions', JSON.stringify(mock));
    }

    // Set initial month/year to current date
    const today = new Date();
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());

    // Check saved theme
    const savedTheme = localStorage.getItem('rekap_keuangan_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Sync dark mode class
  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rekap_keuangan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rekap_keuangan_theme', 'light');
    }
  };

  // Add transaction
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    const updated = [transaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem('rekap_keuangan_transactions', JSON.stringify(updated));

    // Auto switch to added transaction's month and year
    const txDate = new Date(newTx.date);
    if (!isNaN(txDate.getTime())) {
      setSelectedMonth(txDate.getMonth() + 1);
      setSelectedYear(txDate.getFullYear());
    }
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('rekap_keuangan_transactions', JSON.stringify(updated));
  };

  // Import transactions
  const handleImportTransactions = (imported: Transaction[]) => {
    setTransactions(imported);
    localStorage.setItem('rekap_keuangan_transactions', JSON.stringify(imported));

    if (imported.length > 0) {
      const sorted = [...imported].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const latestDate = new Date(sorted[0].date);
      if (!isNaN(latestDate.getTime())) {
        setSelectedMonth(latestDate.getMonth() + 1);
        setSelectedYear(latestDate.getFullYear());
      }
    }
  };

  // Clear all transactions
  const handleClearAll = () => {
    setTransactions([]);
    localStorage.setItem('rekap_keuangan_transactions', JSON.stringify([]));
  };

  // Filter transactions for calculations
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return !isNaN(d.getTime()) && (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  // Period options for dropdown select
  const periodOptions = getMonthYearOptions(transactions);

  // Quick period navigation
  const navigatePeriod = (direction: 'PREV' | 'NEXT') => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (direction === 'PREV') {
      if (selectedMonth === 1) {
        newMonth = 12;
        newYear = selectedYear - 1;
      } else {
        newMonth = selectedMonth - 1;
      }
    } else {
      if (selectedMonth === 12) {
        newMonth = 1;
        newYear = selectedYear + 1;
      } else {
        newMonth = selectedMonth + 1;
      }
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const activePeriodLabel = `${MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;

  // Calculated stats for sidebar & widget
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
  const safeSavingsRate = Math.max(0, Math.min(100, savingsRate));

  if (!isLoggedIn) {
    return (
      <LoginOnboard
        onLogin={handleLogin}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col md:flex-row transition-colors duration-200">
      
      {/* SIDEBAR COMPONENT - Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sky-50/95 dark:bg-slate-900 text-slate-800 dark:text-slate-300 flex flex-col h-full shrink-0 transform transition-transform duration-300 ease-in-out border-r border-sky-100 dark:border-slate-800/80 shadow-xl ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex flex-col h-full justify-between">
          
          <div>
            {/* Sidebar Logo */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-bold text-sky-950 dark:text-white tracking-tight leading-none block">FinTrack</span>
                  <span className="text-[9px] uppercase tracking-wider text-sky-600/80 dark:text-slate-500 font-bold">Rekap Keuangan</span>
                </div>
              </div>
              
              {/* Close Button / Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-sky-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Tutup Laci"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Navigation Options */}
            <nav className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-sky-700/80 dark:text-slate-500 font-bold px-3 mb-2">Menu Utama</p>
                
                <button
                  onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    activeView === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'hover:bg-sky-100/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Beranda</span>
                </button>

                <button
                  onClick={() => { setActiveView('reports'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    activeView === 'reports'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'hover:bg-sky-100/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200'
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                  <span>Analisis Grafik</span>
                </button>

                <button
                  onClick={() => { setActiveView('transactions'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
                    activeView === 'transactions'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'hover:bg-sky-100/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200'
                  }`}
                >
                  <ListCollapse className="w-4 h-4" />
                  <span>Daftar Transaksi</span>
                </button>
              </div>

            </nav>
          </div>

          {/* Premium Tag, Logout & Account Info at sidebar bottom */}
          <div className="pt-6 border-t border-sky-100 dark:border-slate-800/50">
            <div className="p-4 bg-sky-100/50 border border-sky-200/40 dark:bg-slate-800/60 dark:border-slate-700/30 rounded-2xl">
              <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Akun Premium Aktif</span>
              </div>
              <p className="text-[10px] text-sky-700/70 dark:text-slate-400 leading-normal">
                Sistem pembukuan lokal berkecepatan tinggi & privat.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 mt-3 rounded-xl transition-all text-sm font-semibold text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20 cursor-pointer"
              title="Keluar dari Aplikasi"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* MAIN VIEW CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarOpen ? 'md:pl-64' : 'md:pl-0'
      }`}>
        
        {/* TOP COMPACT HEADER ROW */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Button / Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Buka/Tutup Laci Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {activeView === 'dashboard' && 'Dasbor Ringkasan'}
                {activeView === 'reports' && 'Analisis Laporan Grafik'}
                {activeView === 'transactions' && 'Buku Jurnal Kas'}
              </h2>
              <p className="text-xs text-slate-400">
                Periode aktif: <span className="font-semibold text-indigo-500">{activePeriodLabel}</span>
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Ubah Tema Visual"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Quick Add Shortcut */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Transaksi</span>
            </button>

            {/* Vertical Split Line */}
            <span className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{username}</p>
                <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{userEmail}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>

          </div>
        </header>

        {/* CONTAINER CONTENT AREA */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-x-hidden">
          
          {/* Welcome Period Selector Panel */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                Siklus Pembukuan Digital
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Pilih atau navigasi bulan pembukuan untuk menyaring laporan & metrik keuangan Anda secara real-time.
              </p>
            </div>

            {/* Fast Navigators */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
              <button
                onClick={() => navigatePeriod('PREV')}
                className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <select
                value={`${selectedMonth}-${selectedYear}`}
                onChange={(e) => {
                  const [m, y] = e.target.value.split('-').map(Number);
                  setSelectedMonth(m);
                  setSelectedYear(y);
                }}
                className="px-2.5 py-1 bg-transparent border-0 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {periodOptions.map(opt => (
                  <option key={`${opt.month}-${opt.year}`} value={`${opt.month}-${opt.year}`}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigatePeriod('NEXT')}
                className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* VIEWS ROUTER */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              
              {/* VIEW 1: DASHBOARD */}
              {activeView === 'dashboard' && (
                <>
                  {/* Metric summary boxes */}
                  <MetricCards totalIncome={totalIncome} totalExpense={totalExpense} />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Charts summary preview */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      <VisualReports
                        transactions={transactions}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                      />

                      {/* SAVINGS TARGET AND ALLOCATION GRAPHICS (Professional Polish Accent widget) */}
                      <div className="bg-indigo-900 dark:bg-indigo-950 p-6 rounded-3xl text-white shadow-md border border-indigo-800/40">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-300" />
                          Rasio & Alokasi Target Tabungan
                        </h4>
                        
                        <div className="mb-2.5 flex justify-between text-xs">
                          <span className="text-indigo-200">Dana Impian</span>
                          <span className="font-bold">{safeSavingsRate}%</span>
                        </div>
                        <div className="w-full bg-indigo-950/70 h-2 rounded-full mb-6 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${safeSavingsRate}%` }}
                          />
                        </div>

                        <div className="mb-2.5 flex justify-between text-xs">
                          <span className="text-indigo-200">Rasio Pengeluaran</span>
                          <span className="font-bold">{totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-indigo-950/70 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0}%` }}
                          />
                        </div>

                        <div className="mt-5 pt-4 border-t border-indigo-800/60 flex items-center justify-between text-[11px] text-indigo-200">
                          <span>Kesehatan Anggaran</span>
                          <span className="font-bold bg-indigo-800 px-2 py-0.5 rounded-md text-emerald-400 uppercase tracking-wider text-[9px]">
                            {safeSavingsRate >= 20 ? 'Sangat Sehat' : 'Perlu Penghematan'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick overview of latest transactions list */}
                    <div className="lg:col-span-7">
                      <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={handleDeleteTransaction}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onClearAll={handleClearAll}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 2: REPORTS */}
              {activeView === 'reports' && (
                <div className="space-y-6">
                  <MetricCards totalIncome={totalIncome} totalExpense={totalExpense} />
                  <VisualReports
                    transactions={transactions}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                </div>
              )}

              {/* VIEW 3: TRANSACTIONS LIST */}
              {activeView === 'transactions' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                    <p className="text-xs text-slate-500">
                      Seluruh transaksi yang terdaftar pada bulan ini. Klik tombol <strong className="text-indigo-500">Tambah Transaksi</strong> di pojok kanan atas untuk menambah data baru.
                    </p>
                  </div>
                  <TransactionList
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onClearAll={handleClearAll}
                  />
                </div>
              )}



            </motion.div>
          </AnimatePresence>

        </main>

        {/* Dynamic footer */}
        <footer className="px-8 py-8 text-center text-[10px] text-slate-400 space-y-1.5 border-t border-slate-200/50 dark:border-slate-800/60 mt-12">
          <div className="flex items-center justify-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-bold text-slate-600 dark:text-slate-300">Rekap Keuangan v1.2</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>by ARNOF DWI FERDIZA</span>
          </div>
          <p>
            Data Anda sepenuhnya disimpan di dalam peramban lokal (LocalStorage) secara privat & aman.
          </p>
        </footer>

      </div>

      {/* Add Transaction Overlay Sheet */}
      <AnimatePresence>
        {isAddOpen && (
          <TransactionForm
            isOpen={isAddOpen}
            onAddTransaction={handleAddTransaction}
            onClose={() => setIsAddOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

