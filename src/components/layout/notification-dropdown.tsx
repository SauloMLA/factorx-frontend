'use client';

import { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNotificationsQuery, useMarkAllNotificationsReadMutation, NotificationItem } from '@/hooks/useNotifications';
import { useLanguage } from '@/context/language-context';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [] } = useNotificationsQuery();
  const markAllMutation = useMarkAllNotificationsReadMutation();
  const { t, language } = useLanguage();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllMutation.mutate();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'WARNING':
      case 'DANGER':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  const locale = language === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111625] rounded-xl transition-colors focus:outline-none cursor-pointer"
        title={t('notif.title')}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md shadow-blue-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-[#1e293b]/60 shadow-2xl z-40 overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1e293b]/40 bg-slate-50/50 dark:bg-[#111625]/60">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{t('notif.title')}</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                    {unreadCount} {t('notif.new')}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllMutation.isPending}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  {t('notif.mark_read')}
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1e293b]/30">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  {t('notif.empty')}
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs flex gap-3 items-start transition-colors ${
                      !item.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-[#1e293b]/20'
                    }`}
                  >
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-mono">
                        {new Date(item.createdAt).toLocaleString(locale, {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
