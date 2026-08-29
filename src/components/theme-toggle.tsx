'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { spring } from '@/lib/motion';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[140px] h-9 rounded-xl bg-muted/50 border border-border animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';
  const labelDark = language === 'en' ? 'Dark' : 'Oscuro';
  const labelLight = language === 'en' ? 'Light' : 'Claro';

  return (
    <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border text-xs font-semibold select-none">
      {/* Botón Oscuro */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
          isDark ? 'text-[oklch(0.76_0.12_82)] font-bold' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={labelDark}
      >
        {isDark && (
          <motion.div
            layoutId="theme-active-pill"
            className="absolute inset-0 rounded-lg bg-[oklch(0.76_0.12_82/0.14)] border border-[oklch(0.76_0.12_82/0.3)] shadow-[0_0_12px_oklch(0.76_0.12_82/0.1)]"
            transition={{ ...spring, stiffness: 500, damping: 35 }}
          />
        )}
        <Moon className="w-3.5 h-3.5 relative z-10" />
        <span className="relative z-10">{labelDark}</span>
      </button>

      {/* Botón Claro */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
          !isDark ? 'text-[oklch(0.68_0.14_75)] font-bold' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={labelLight}
      >
        {!isDark && (
          <motion.div
            layoutId="theme-active-pill"
            className="absolute inset-0 rounded-lg bg-card text-card-foreground shadow-sm border border-border"
            transition={{ ...spring, stiffness: 500, damping: 35 }}
          />
        )}
        <Sun className="w-3.5 h-3.5 relative z-10" />
        <span className="relative z-10">{labelLight}</span>
      </button>
    </div>
  );
}
