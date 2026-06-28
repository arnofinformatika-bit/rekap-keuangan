import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coins, LogIn, Mail, User, Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';

interface LoginOnboardProps {
  onLogin: (name: string, email: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const LoginOnboard: React.FC<LoginOnboardProps> = ({
  onLogin,
  isDarkMode,
  toggleDarkMode
}) => {
  const [name, setName] = useState('Arno');
  const [email, setEmail] = useState('arnofinformatika@gmail.com');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Silakan masukkan nama Anda.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Silakan masukkan email yang valid.');
      return;
    }
    onLogin(name.trim(), email.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-200">
      
      {/* Absolute decorative glow objects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 shadow-xs transition-all cursor-pointer"
          title="Ubah Tema Visual"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        {/* App Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl shadow-indigo-600/30 mb-4 animate-bounce-slow">
            <Coins className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Selamat Datang di <span className="text-indigo-600 dark:text-indigo-400">FinTrack</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs">
            Aplikasi rekapitulasi pembukuan kas pribadi yang aman, cepat, dan sepenuhnya privat.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Masuk Jurnal Kas</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Nama Pengguna
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan nama Anda..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white font-semibold"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan email Anda..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white font-semibold"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer mt-2 group"
            >
              <span>Mulai Kelola Keuangan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Info Disclaimer */}
        <p className="text-center text-[10px] text-slate-400 mt-6 max-w-xs mx-auto leading-normal">
          Data Anda disimpan secara lokal di perangkat Anda (offline-first) dan tidak pernah dikirim ke server luar manapun.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginOnboard;
