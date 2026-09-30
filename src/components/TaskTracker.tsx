import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Check, Loader, Circle, Calendar, Trash2 } from 'lucide-react';
import { useApp, CaseStatus } from '@/store';
import { useState } from 'react';

const statusConfig: Record<CaseStatus, { color: string; bg: string; icon: any; ring: string }> = {
  pending: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: Clock,
    ring: 'ring-amber-200',
  },
  inProgress: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: Loader,
    ring: 'ring-blue-200',
  },
  resolved: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    icon: Check,
    ring: 'ring-emerald-200',
  },
};

const statusOrder: CaseStatus[] = ['pending', 'inProgress', 'resolved'];

export default function TaskTracker() {
  const { t, lang, cases, addCase, updateCaseStatus } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addCase(newTitle.trim(), newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  const cycleStatus = (id: string, current: CaseStatus) => {
    const idx = statusOrder.indexOf(current);
    const next = statusOrder[(idx + 1) % statusOrder.length];
    updateCaseStatus(id, next);
  };

  const daysUntil = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-ink-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-ink-800">{t.tracker.title}</h3>
          <button
            onClick={() => setIsAdding((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-ink-50 transition-colors text-indigo-500"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-ink-400">{t.tracker.subtitle}</p>
      </div>

      {/* Add new */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pt-3 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder={t.tracker.addPlaceholder}
                autoFocus
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-ink-200 outline-none focus:border-indigo-300 bg-white text-ink-700"
              />
              <button
                onClick={handleAdd}
                className="px-3 py-2 rounded-xl gradient-indigo text-white text-sm font-medium"
              >
                <Check size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cases list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cases.length === 0 && (
          <div className="text-center py-8">
            <Circle size={28} className="text-ink-200 mx-auto mb-2" />
            <p className="text-xs text-ink-400">{t.tracker.empty}</p>
          </div>
        )}

        {cases.map((item, i) => {
          const config = statusConfig[item.status];
  const StatusIcon = config.icon;
          const days = daysUntil(item.deadline);
          const isOverdue = days < 0 && item.status !== 'resolved';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-ink-100 p-3.5 hover:shadow-md hover:shadow-ink-900/5 hover:border-ink-200 transition-all cursor-pointer group"
              onClick={() => cycleStatus(item.id, item.status)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-800 truncate">
                    {lang === 'en' ? item.titleEn : item.title}
                  </p>
                  {item.amount && (
                    <p className="text-xs text-indigo-500 font-medium mt-0.5">{item.amount}</p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${config.bg} ${config.color} ring-1 ${config.ring}`}
                >
                  <StatusIcon size={11} className={item.status === 'inProgress' ? 'animate-spin' : ''} />
                  {t.tracker.status[item.status]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-ink-400">
                  <Calendar size={12} />
                  <span>
                    {new Date(item.deadline).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                {item.status !== 'resolved' && (
                  <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-500' : days <= 3 ? 'text-amber-500' : 'text-ink-400'}`}>
                    {isOverdue
                      ? `${Math.abs(days)} ${lang === 'tr' ? 'gün gecikti' : 'days overdue'}`
                      : `${days} ${t.tracker.days}`}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="p-4 border-t border-ink-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-amber-500">
              {cases.filter((c) => c.status === 'pending').length}
            </p>
            <p className="text-[10px] text-ink-400">{t.tracker.status.pending}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-500">
              {cases.filter((c) => c.status === 'inProgress').length}
            </p>
            <p className="text-[10px] text-ink-400">{t.tracker.status.inProgress}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-500">
              {cases.filter((c) => c.status === 'resolved').length}
            </p>
            <p className="text-[10px] text-ink-400">{t.tracker.status.resolved}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
