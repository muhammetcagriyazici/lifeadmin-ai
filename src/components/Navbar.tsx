import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, ChevronDown, LogOut, User, Bell } from 'lucide-react';
import { useApp, getInitials } from '@/store';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { lang, setLang, t, currentUser, logout } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) return null;

  const initials = getInitials(currentUser.name);

  return (
    <header className="h-16 glass border-b border-ink-100 flex items-center justify-between px-4 md:px-6 relative z-30">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded-lg hover:bg-ink-100 transition-colors">
          <Menu size={20} className="text-ink-600" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield size={20} className="text-white" strokeWidth={2.2} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-ink-800 leading-tight">{t.app.name}</h1>
            <p className="text-[10px] text-ink-400 leading-tight">{t.app.tagline}</p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <div className="flex items-center bg-ink-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setLang('tr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'tr'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-ink-400 hover:text-ink-600'
            }`}
          >
            TR
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'en'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-ink-400 hover:text-ink-600'
            }`}
          >
            EN
          </button>
        </div>

        {/* Notifications */}
        <button className="hidden sm:flex p-2.5 rounded-xl hover:bg-ink-100 transition-colors relative text-ink-500">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-ink-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg gradient-indigo flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-ink-700 max-w-[100px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown size={16} className={`text-ink-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-ink-900/10 border border-ink-100 overflow-hidden"
              >
                <div className="p-4 border-b border-ink-50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl gradient-indigo flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-800 truncate">{t.profile.greeting}, {currentUser.name.split(' ')[0]}</p>
                      <p className="text-xs text-indigo-500 font-medium">{t.profile.plan} ⚡</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-600 hover:bg-ink-50 transition-colors">
                    <User size={16} />
                    {lang === 'tr' ? 'Profilim' : 'My Profile'}
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    {t.profile.signOut}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
