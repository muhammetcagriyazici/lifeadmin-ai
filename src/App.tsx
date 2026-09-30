import { AppProvider, useApp, AppView } from '@/store';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import DraftSection from '@/components/DraftSection';
import TaskTracker from '@/components/TaskTracker';
import Dashboard from '@/components/Dashboard';
import CasesView from '@/components/CasesView';
import SettingsView from '@/components/SettingsView';
import AdminPanel from '@/components/AdminPanel';
import LoginScreen from '@/components/LoginScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LayoutDashboard, FolderOpen, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

function MainLayout() {
  const { activeView, t, lang, currentUser } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileTrackerOpen, setMobileTrackerOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="h-screen flex flex-col bg-ink-50 overflow-hidden">
      <Navbar />

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="md:hidden fixed inset-0 bg-ink-900/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="md:hidden fixed left-0 top-16 bottom-0 w-60 bg-white z-40 shadow-xl"
            >
              <MobileNav onClose={() => setMobileNavOpen(false)} isAdmin={isAdmin} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Mobile nav button */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="md:hidden fixed bottom-20 left-4 z-30 w-12 h-12 rounded-xl gradient-indigo text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center"
        >
          <Menu size={20} />
        </button>

        {/* Main content area */}
        <main className="flex-1 flex overflow-hidden">
          {activeView === 'dashboard' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Center canvas */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top half - Chat */}
                <div className="flex-1 overflow-hidden border-b border-ink-100 lg:border-b lg:border-r border-ink-100 min-h-0">
                  <ChatInput />
                </div>
                {/* Bottom half - Draft */}
                <div className="h-[45%] lg:h-[42%] flex-shrink-0 overflow-hidden bg-ink-50/50">
                  <DraftSection />
                </div>
              </div>

              {/* Right sidebar - Task Tracker (desktop) */}
              <div className="hidden lg:flex w-72 flex-shrink-0 border-l border-ink-100 glass">
                <TaskTracker />
              </div>
            </div>
          )}

          {activeView === 'cases' && (
            <div className="flex-1 overflow-hidden">
              <CasesView />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="flex-1 overflow-hidden">
              <SettingsView />
            </div>
          )}

          {activeView === 'admin' && isAdmin && (
            <div className="flex-1 overflow-hidden">
              <AdminPanel />
            </div>
          )}
        </main>
      </div>

      {/* Mobile tracker toggle */}
      {activeView === 'dashboard' && (
        <button
          onClick={() => setMobileTrackerOpen(true)}
          className="lg:hidden fixed bottom-20 right-4 z-30 w-12 h-12 rounded-xl bg-white border border-ink-100 text-indigo-500 shadow-lg flex items-center justify-center"
        >
          <FolderOpen size={20} />
        </button>
      )}

      <AnimatePresence>
        {mobileTrackerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileTrackerOpen(false)}
              className="lg:hidden fixed inset-0 bg-ink-900/30 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="lg:hidden fixed right-0 top-16 bottom-0 w-80 bg-white z-40 shadow-xl"
            >
              <button
                onClick={() => setMobileTrackerOpen(false)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-ink-50"
              >
                <X size={18} className="text-ink-400" />
              </button>
              <TaskTracker />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNav({ onClose, isAdmin }: { onClose: () => void; isAdmin: boolean }) {
  const { t, activeView, setActiveView } = useApp();

  const items: { id: AppView; label: string; icon: any }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'cases', label: t.nav.cases, icon: FolderOpen },
    { id: 'settings', label: t.nav.settings, icon: SettingsIcon },
  ];

  if (isAdmin) {
    items.push({ id: 'admin', label: t.nav.admin, icon: ShieldCheck });
  }

  return (
    <div className="flex flex-col h-full p-3">
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive ? 'gradient-indigo-soft text-indigo-700' : 'text-ink-500 hover:bg-ink-50'
              }`}
            >
              <item.icon size={20} strokeWidth={1.8} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
