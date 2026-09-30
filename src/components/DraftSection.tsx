import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, FileText, Copy, Check, Send, FileEdit } from 'lucide-react';
import { useApp } from '@/store';
import { generateDraft } from '@/ai';
import { useState, useMemo } from 'react';

export default function DraftSection() {
  const { t, lang, draftTab, setDraftTab, hasDraft, messages } = useApp();
  const [copied, setCopied] = useState(false);

  const lastUserQuery = useMemo(() => {
    const userMsgs = messages.filter((m) => m.role === 'user');
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].content : '';
  }, [messages]);

  const draft = useMemo(() => generateDraft(draftTab, lastUserQuery, lang as 'tr' | 'en'), [draftTab, lastUserQuery, lang]);

  const handleCopy = () => {
    const fullText = draft.subject
      ? `${t.draft.subject}: ${draft.subject}\n${t.draft.to}: ${draft.recipient}\n\n${draft.content}`
      : draft.content;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'email' as const, label: t.draft.email, icon: Mail },
    { id: 'whatsapp' as const, label: t.draft.whatsapp, icon: MessageSquare },
    { id: 'formal' as const, label: t.draft.formal, icon: FileText },
  ];

  if (!hasDraft) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-ink-50 flex items-center justify-center mb-3">
          <FileEdit size={26} className="text-ink-300" />
        </div>
        <p className="text-sm font-medium text-ink-400">
          {lang === 'tr'
            ? 'Bir sorun yazdığınızda taslak burada otomatik oluşur.'
            : 'Your draft will appear here once you describe your issue.'}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 pb-3 border-b border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-ink-800">{t.draft.title}</h3>
            <p className="text-xs text-ink-400">{t.draft.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ink-50 p-1 rounded-xl">
          {tabs.map((tab) => {
            const isActive = draftTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDraftTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-ink-400 hover:text-ink-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="draft-tab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <tab.icon size={14} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Draft content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={draftTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {draft.subject && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-ink-400 w-12">{t.draft.subject}:</label>
                  <div className="flex-1 text-sm text-ink-700 font-medium bg-ink-50 px-3 py-1.5 rounded-lg">
                    {draft.subject}
                  </div>
                </div>
                {draft.recipient && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-ink-400 w-12">{t.draft.to}:</label>
                    <div className="flex-1 text-sm text-ink-600 bg-ink-50 px-3 py-1.5 rounded-lg">
                      {draft.recipient}
                    </div>
                  </div>
                )}
              </div>
            )}
            <pre className="text-sm text-ink-700 whitespace-pre-wrap font-sans leading-relaxed bg-ink-50/50 rounded-xl p-4 border border-ink-50">
              {draft.content}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-ink-100 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-indigo text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Check size={16} />
                {t.draft.copied}
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                {t.draft.copy}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-ink-100 text-ink-600 text-sm font-medium hover:bg-ink-200 transition-colors">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
