import { motion } from 'framer-motion';
import { Search, Filter, Clock, Loader, Check, Calendar } from 'lucide-react';
import { useApp, CaseStatus } from '@/store';
import { useState } from 'react';

const statusConfig: Record<CaseStatus, { color: string; bg: string; icon: any; ring: string; label: string }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, ring: 'ring-amber-200', label: 'status.pending' },
  inProgress: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Loader, ring: 'ring-blue-200', label: 'status.inProgress' },
  resolved: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Check, ring: 'ring-emerald-200', label: 'status.resolved' },
};

export default function CasesView() {
  const { t, lang, cases } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CaseStatus | 'all'>('all');

  const filtered = cases.filter((c) => {
    const title = lang === 'en' ? c.titleEn : c.title;
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filters: { id: CaseStatus | 'all'; label: string }[] = [
    { id: 'all', label: lang === 'tr' ? 'Tümü' : 'All' },
    { id: 'pending', label: t.tracker.status.pending },
    { id: 'inProgress', label: t.tracker.status.inProgress },
    { id: 'resolved', label: t.tracker.status.resolved },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ink-800 mb-1">{t.nav.cases}</h2>
        <p className="text-sm text-ink-400">{t.tracker.subtitle}</p>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'tr' ? 'Talep ara...' : 'Search cases...'}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-ink-100 bg-white outline-none focus:border-indigo-300 text-ink-700"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                filter === f.id
                  ? 'gradient-indigo text-white shadow-sm'
                  : 'bg-white border border-ink-100 text-ink-500 hover:border-ink-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cases grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item, i) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;
          const days = Math.ceil((new Date(item.deadline).getTime() - Date.now()) / 86400000);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-ink-100 p-4 hover:shadow-md hover:shadow-ink-900/5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink-800">{lang === 'en' ? item.titleEn : item.title}</h3>
                  {item.amount && <p className="text-xs text-indigo-500 font-medium mt-0.5">{item.amount}</p>}
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${config.bg} ${config.color} ring-1 ${config.ring}`}>
                  <StatusIcon size={11} className={item.status === 'inProgress' ? 'animate-spin' : ''} />
                  {t.tracker.status[item.status]}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-400">
                <Calendar size={12} />
                <span>
                  {new Date(item.deadline).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {item.status !== 'resolved' && (
                  <span className={`ml-auto font-medium ${days < 0 ? 'text-red-500' : days <= 3 ? 'text-amber-500' : ''}`}>
                    {days < 0
                      ? `${Math.abs(days)} ${lang === 'tr' ? 'gün gecikti' : 'days overdue'}`
                      : `${days} ${t.tracker.days}`}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-ink-400">{t.tracker.empty}</p>
        </div>
      )}
    </div>
  );
}
