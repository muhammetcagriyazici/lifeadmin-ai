import { motion } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Settings as SettingsIcon, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp, AppView } from '@/store';

export default function Sidebar() {
  const { t, lang, sidebarCollapsed, toggleSidebar, activeView, setActiveView, currentUser } = useApp();

  const navItems: { id: AppView; label: string; icon: any }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'cases', label: t.nav.cases, icon: FolderOpen },
    { id: 'settings', label: t.nav.settings, icon: SettingsIcon },
  ];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="hidden md:flex flex-col glass border-r border-ink-100 h-full relative z-20"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-ink-100">
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-medium text-ink-400 uppercase tracking-wider"
          >
            {lang === 'tr' ? 'Menü' : 'Menu'}
          </motion.span>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg hover:bg-ink-100 transition-colors text-ink-400 ${
            sidebarCollapsed ? 'mx-auto' : ''
          }`}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'gradient-indigo-soft text-indigo-700'
                  : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-indigo"
                />
              )}
              <item.icon
                size={20}
                strokeWidth={1.8}
                className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : ''}`}
              />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-sm font-medium ${isActive ? 'text-indigo-700' : ''}`}
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}

        {/* Admin section */}
        {isAdmin && (
          <>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 pb-1 px-3"
              >
                <span className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">
                  {lang === 'tr' ? 'Yönetim' : 'Administration'}
                </span>
              </motion.div>
            )}
            <button
              onClick={() => setActiveView('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                activeView === 'admin'
                  ? 'gradient-indigo-soft text-indigo-700'
                  : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
              }`}
            >
              {activeView === 'admin' && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-indigo"
                />
              )}
              <ShieldCheck
                size={20}
                strokeWidth={1.8}
                className={`flex-shrink-0 ${activeView === 'admin' ? 'text-indigo-600' : ''}`}
              />
              {!sidebarCollapsed && (
                <span className={`text-sm font-medium ${activeView === 'admin' ? 'text-indigo-700' : ''}`}>
                  {t.nav.admin}
                </span>
              )}
            </button>
          </>
        )}
      </nav>

      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 m-3 rounded-2xl gradient-indigo text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white" />
            <div className="absolute -bottom-6 -left-2 w-16 h-16 rounded-full bg-white" />
          </div>
          <div className="relative">
            <p className="text-xs font-semibold opacity-90 mb-1">
              {lang === 'tr' ? 'Pro' : 'Pro'} ⚡
            </p>
            <p className="text-sm font-bold mb-2">
              {lang === 'tr' ? 'Sınırsız talep' : 'Unlimited cases'}
            </p>
            <button className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg font-medium w-full">
              {lang === 'tr' ? 'Yükselt' : 'Upgrade'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
