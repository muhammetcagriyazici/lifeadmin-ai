import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Wallet, Percent, ArrowUpRight, Activity } from 'lucide-react';
import { useApp } from '@/store';

export default function Dashboard() {
  const { t, lang, cases } = useApp();

  const activeCount = cases.filter((c) => c.status !== 'resolved').length;
  const resolvedCount = cases.filter((c) => c.status === 'resolved').length;

  const stats = [
    {
      label: t.dashboard.stats.active,
      value: activeCount.toString(),
      change: '+2',
      icon: TrendingUp,
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    {
      label: t.dashboard.stats.resolved,
      value: resolvedCount.toString(),
      change: '+1',
      icon: CheckCircle2,
      color: 'emerald',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: t.dashboard.stats.saved,
      value: '₺3.530',
      change: '+₺480',
      icon: Wallet,
      color: 'violet',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
    },
    {
      label: t.dashboard.stats.responseRate,
      value: '%87',
      change: '+%5',
      icon: Percent,
      color: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  ];

  const activities = cases.slice(0, 4).map((c) => ({
    id: c.id,
    title: lang === 'en' ? c.titleEn : c.title,
    status: c.status,
    time: lang === 'tr' ? `${Math.ceil((Date.now() - c.createdAt) / 86400000)} gün önce` : `${Math.ceil((Date.now() - c.createdAt) / 86400000)} days ago`,
  }));

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-ink-100 p-4 hover:shadow-md hover:shadow-ink-900/5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.text} />
              </div>
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
                {stat.change}
                <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-2xl font-bold text-ink-800">{stat.value}</p>
            <p className="text-xs text-ink-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-ink-100 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-ink-800">{t.dashboard.recent}</h3>
        </div>

        <div className="space-y-3">
          {activities.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center justify-between py-2 border-b border-ink-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    act.status === 'resolved'
                      ? 'bg-emerald-400'
                      : act.status === 'inProgress'
                        ? 'bg-blue-400'
                        : 'bg-amber-400'
                  }`}
                />
                <span className="text-sm text-ink-700 font-medium">{act.title}</span>
              </div>
              <span className="text-xs text-ink-400">{act.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
