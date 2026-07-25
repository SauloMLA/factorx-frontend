'use client';

import { useLanguage } from '@/context/language-context';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 p-1 rounded-xl shadow-inner text-xs font-semibold">
      <div className="pl-1.5 pr-0.5 text-slate-400 dark:text-slate-500 flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
          language === 'es'
            ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
          language === 'en'
            ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}
