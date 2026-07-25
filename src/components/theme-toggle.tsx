'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-20 h-7 rounded-xl bg-slate-100 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 animate-pulse" />;
  }

  const isDark = resolvedTheme === 'dark';

  const labelDark = language === 'en' ? 'DARK' : 'OSCURO';
  const labelLight = language === 'en' ? 'LIGHT' : 'CLARO';

  return (
    <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 p-1 rounded-xl shadow-inner text-[10px] font-bold">
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-800 text-blue-400 font-extrabold shadow-sm border border-slate-700'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        {labelDark}
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
          !isDark
            ? 'bg-white text-blue-600 font-extrabold shadow-sm border border-slate-200'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        {labelLight}
      </button>
    </div>
  );
}
