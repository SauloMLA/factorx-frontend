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
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'WARNING':
      case 'DANGER':
        return <AlertTriangle className="w-4 h-4 text-[oklch(0.76_0.12_82)] shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[oklch(0.76_0.12_82)] shrink-0" />;
    }
  };

  const locale = language === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors focus:outline-none cursor-pointer"
        title={t('notif.title')}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-[oklch(0.07_0_0)] shadow-md"
            style={{
              background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
              boxShadow: '0 2px 8px oklch(0.76 0.12 82 / 40%)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl z-40 overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">{t('notif.title')}</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-[oklch(0.76_0.12_82/0.15)] text-[oklch(0.76_0.12_82)] border border-[oklch(0.76_0.12_82/0.25)] rounded-full font-bold">
                    {unreadCount} {t('notif.new')}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllMutation.isPending}
                  className="text-xs text-[oklch(0.76_0.12_82)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  {t('notif.mark_read')}
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  {t('notif.empty')}
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs flex gap-3 items-start transition-colors ${
                      !item.isRead ? 'bg-[oklch(0.76_0.12_82/0.06)]' : 'hover:bg-muted/40'
                    }`}
                  >
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed text-xs">{item.message}</p>
                      <span className="text-[10px] text-muted-foreground/60 mt-1 block font-mono">
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
