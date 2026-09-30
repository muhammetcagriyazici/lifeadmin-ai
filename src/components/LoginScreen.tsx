import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '@/store';
import { useState } from 'react';

export default function LoginScreen() {
  const { t, lang, setLang, login } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (mode === 'signup' && !name.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      login(email.trim(), mode === 'signup' ? name.trim() : undefined);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-100/40 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-50/50 blur-3xl" />
      </div>

      {/* Language toggle */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center bg-white/80 backdrop-blur-md rounded-xl p-1 gap-1 border border-ink-100">
          <button
            onClick={() => setLang('tr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'tr' ? 'bg-white text-indigo-600 shadow-sm' : 'text-ink-400 hover:text-ink-600'
            }`}
          >
            TR
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-ink-400 hover:text-ink-600'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex w-14 h-14 rounded-2xl gradient-indigo items-center justify-center shadow-xl shadow-indigo-500/25 mb-4"
          >
            <Shield size={28} className="text-white" strokeWidth={2.2} />
          </motion.div>
          <h1 className="text-xl font-bold text-ink-800">{t.app.name}</h1>
          <p className="text-sm text-ink-400">{t.app.tagline}</p>
        </div>

        {/* Auth card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-ink-900/5 p-7">
          <h2 className="text-lg font-bold text-ink-800 mb-1">
            {mode === 'login' ? t.auth.welcome : t.auth.signup}
          </h2>
          <p className="text-sm text-ink-400 mb-6">{t.auth.welcomeSub}</p>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-ink-50 p-1 rounded-xl mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'text-indigo-600' : 'text-ink-400 hover:text-ink-600'
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m === 'login' ? t.auth.login : t.auth.signup}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-xs font-medium text-ink-500 mb-1.5 block">{t.auth.name}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.auth.namePlaceholder}
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-ink-100 bg-white/70 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all text-ink-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs font-medium text-ink-500 mb-1.5 block">{t.auth.email}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  required
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-ink-100 bg-white/70 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all text-ink-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-500 mb-1.5 block">{t.auth.password}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  required
                  className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-ink-100 bg-white/70 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all text-ink-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-indigo text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  {mode === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-ink-300 text-center mt-4 leading-relaxed">
            {t.auth.demoHint}
          </p>
        </div>

        <p className="text-xs text-ink-300 text-center mt-5 leading-relaxed px-4">
          {t.auth.terms}
        </p>
      </motion.div>
    </div>
  );
}
