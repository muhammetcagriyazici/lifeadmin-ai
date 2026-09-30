import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, ArrowUp, Sparkles, Shield, CheckCircle2, Lightbulb, ListTodo } from 'lucide-react';
import { useApp } from '@/store';
import { analyzeQuery } from '@/ai';
import { useState, useRef, useEffect } from 'react';

export default function ChatInput() {
  const { t, lang, messages, addMessage, setHasDraft } = useApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = (text: string) => {
    const query = text.trim();
    if (!query) return;

    addMessage({ role: 'user', content: query, contentEn: query });
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const analysis = analyzeQuery(query);
      addMessage({
        role: 'ai',
        content: analysis.response,
        contentEn: analysis.responseEn,
        rights: lang === 'tr' ? analysis.rights : analysis.rightsEn,
        rightsEn: analysis.rightsEn,
        recommendation: lang === 'tr' ? analysis.recommendation : analysis.recommendationEn,
        recommendationEn: analysis.recommendationEn,
        nextSteps: lang === 'tr' ? analysis.nextSteps : analysis.nextStepsEn,
        nextStepsEn: analysis.nextStepsEn,
      });
      setIsThinking(false);
      setHasDraft(true);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Input area */}
      <div className="p-4 md:p-6 pb-3">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-bold text-ink-800 mb-1"
        >
          {t.input.title}
        </motion.h2>
        <p className="text-sm text-ink-400 mb-4">
          {lang === 'tr' ? 'Tüketici haklarınızı öğrenin, taslak oluşturun.' : 'Learn your rights, generate drafts.'}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-ink-100 shadow-sm shadow-ink-900/5 focus-within:border-indigo-300 focus-within:shadow-indigo-500/10 transition-all"
        >
          <div className="flex items-end gap-2 p-3">
            <button
              className="p-2.5 rounded-xl hover:bg-ink-50 transition-colors text-ink-400 hover:text-indigo-500 flex-shrink-0"
              title={t.input.attach}
            >
              <Paperclip size={20} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.input.placeholder}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-ink-800 placeholder:text-ink-300 outline-none py-2.5 max-h-32"
            />
            <motion.button
              whileHover={{ scale: input.trim() ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() ? 0.95 : 1 }}
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                input.trim()
                  ? 'gradient-indigo text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-ink-100 text-ink-300 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {t.input.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-2 rounded-xl bg-white border border-ink-100 text-ink-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} lang={lang} t={t} />
        ))}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm border border-ink-100 px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-indigo-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ChatBubble({ message, lang, t }: { message: any; lang: string; t: any }) {
  const isAI = message.role === 'ai';
  const content = lang === 'en' && message.contentEn ? message.contentEn : message.content;

  if (!content && isAI) {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-sm border border-ink-100 px-4 py-3 max-w-[80%]">
          <p className="text-sm text-ink-600">{lang === 'tr' ? t.ai.greeting : t.ai.greeting}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isAI ? 'gradient-indigo' : 'bg-ink-200'
        }`}
      >
        {isAI ? (
          <Sparkles size={16} className="text-white" />
        ) : (
          <span className="text-xs font-bold text-ink-600">AK</span>
        )}
      </div>
      <div className={`max-w-[85%] ${isAI ? '' : 'items-end'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAI
              ? 'bg-white border border-ink-100 rounded-tl-sm'
              : 'gradient-indigo text-white rounded-tr-sm'
          }`}
        >
          <p className={`text-sm leading-relaxed ${isAI ? 'text-ink-700' : 'text-white'}`}>{content}</p>
        </div>

        {/* AI analysis details */}
        {isAI && message.rights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
            className="mt-3 space-y-3"
          >
            <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={15} className="text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{t.ai.right}</span>
              </div>
              <ul className="space-y-1.5">
                {(lang === 'en' ? message.rightsEn : message.rights).map((r: string, i: number) => (
                  <li key={i} className="flex gap-2 text-xs text-ink-600 leading-relaxed">
                    <CheckCircle2 size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-3 border border-ink-100">
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb size={15} className="text-violet-500" />
                <span className="text-xs font-semibold text-ink-700 uppercase tracking-wide">{t.ai.recommendation}</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                {lang === 'en' ? message.recommendationEn : message.recommendation}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-ink-100">
              <div className="flex items-center gap-2 mb-2">
                <ListTodo size={15} className="text-emerald-500" />
                <span className="text-xs font-semibold text-ink-700 uppercase tracking-wide">{t.ai.nextSteps}</span>
              </div>
              <ol className="space-y-1.5">
                {(lang === 'en' ? message.nextStepsEn : message.nextSteps).map((s: string, i: number) => (
                  <li key={i} className="flex gap-2 text-xs text-ink-600 leading-relaxed">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
