import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Clock, Shield, Globe, Info, ChevronRight } from 'lucide-react';
import { useApp } from '@/store';
import { useState } from 'react';

export default function SettingsView() {
  const { t, lang, setLang } = useApp();
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: false,
    deadlineAlerts: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ink-800 mb-1">{t.settings.title}</h2>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-ink-100 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Globe size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-800">{t.settings.language}</h3>
            </div>
          </div>
          <div className="flex gap-2 ml-13">
            <button
              onClick={() => setLang('tr')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                lang === 'tr' ? 'gradient-indigo text-white shadow-sm' : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
              }`}
            >
              Türkçe
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                lang === 'en' ? 'gradient-indigo text-white shadow-sm' : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
              }`}
            >
              English
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-ink-100 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Bell size={20} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-ink-800">{t.settings.notifications}</h3>
          </div>
          <div className="space-y-1">
            <ToggleRow icon={Mail} label={t.settings.emailNotif} value={settings.emailNotif} onChange={() => toggle('emailNotif')} />
            <ToggleRow icon={Smartphone} label={t.settings.pushNotif} value={settings.pushNotif} onChange={() => toggle('pushNotif')} />
            <ToggleRow icon={Clock} label={t.settings.deadlineAlerts} value={settings.deadlineAlerts} onChange={() => toggle('deadlineAlerts')} />
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl border border-ink-100 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Shield size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-ink-800">{t.settings.privacy}</h3>
          </div>
          <div className="space-y-1">
            <LinkRow label={t.settings.dataRetention} value="90 gün" />
            <LinkRow label={t.settings.deleteAccount} value="" danger />
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="bg-white rounded-2xl border border-ink-100 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Info size={20} className="text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-ink-800">{t.settings.about}</h3>
          </div>
          <div className="space-y-1">
            <LinkRow label={t.settings.version} value="1.0.0" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, value, onChange }: { icon: any; label: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-ink-50 transition-colors">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-ink-400" />
        <span className="text-sm text-ink-700">{label}</span>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-all ${value ? 'gradient-indigo' : 'bg-ink-200'}`}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}

function LinkRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-ink-50 transition-colors cursor-pointer">
      <span className={`text-sm ${danger ? 'text-red-500' : 'text-ink-700'}`}>{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-ink-400">{value}</span>}
        <ChevronRight size={16} className="text-ink-300" />
      </div>
    </div>
  );
}
