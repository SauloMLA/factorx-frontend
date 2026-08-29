'use client';

import { useLanguage } from '@/context/language-context';
import { Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { spring } from '@/lib/motion';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border text-xs font-semibold select-none">
      <div className="pl-2 pr-1 text-muted-foreground flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
          language === 'es'
            ? 'text-[oklch(0.76_0.12_82)] font-bold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {language === 'es' && (
          <motion.div
            layoutId="lang-active-pill"
            className="absolute inset-0 rounded-lg bg-[oklch(0.76_0.12_82/0.14)] dark:bg-[oklch(0.76_0.12_82/0.14)] border border-[oklch(0.76_0.12_82/0.3)] shadow-[0_0_12px_oklch(0.76_0.12_82/0.1)]"
            transition={{ ...spring, stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">ES</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
          language === 'en'
            ? 'text-[oklch(0.76_0.12_82)] font-bold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {language === 'en' && (
          <motion.div
            layoutId="lang-active-pill"
            className="absolute inset-0 rounded-lg bg-[oklch(0.76_0.12_82/0.14)] dark:bg-[oklch(0.76_0.12_82/0.14)] border border-[oklch(0.76_0.12_82/0.3)] shadow-[0_0_12px_oklch(0.76_0.12_82/0.1)]"
            transition={{ ...spring, stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
    </div>
  );
}
