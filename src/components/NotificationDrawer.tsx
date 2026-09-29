import React from 'react';
import { AlertTriggerLog, AppSettings } from '../types/crypto';
import { getTranslation } from '../utils/i18n';
import { X, Bell, CheckCheck, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  logs: AlertTriggerLog[];
  settings: AppSettings;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearLogs: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  logs,
  settings,
  onClose,
  onMarkAllAsRead,
  onClearLogs
}) => {
  if (!isOpen) return null;

  const t = getTranslation(settings.language);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.notifications}</h2>
              <span className="text-xs text-slate-400">{logs.length} رویداد</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onMarkAllAsRead}
              title={t.markAllRead}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 text-xs">
              <Bell className="w-8 h-8 mb-2 opacity-40" />
              <span>هیچ اعلان جدیدی وجود ندارد</span>
            </div>
          ) : (
            logs.map((log) => {
              const isUp = log.toPrice >= log.fromPrice;
              return (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !log.read
                      ? 'bg-slate-900 border-amber-500/30 shadow-md shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white">{log.symbol}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400">{log.exchange}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
                    {isUp ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
                    <span>{log.title}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 font-mono whitespace-pre-line bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    {log.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {logs.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={onClearLogs}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearLogs}</span>
            </button>
            <button
              onClick={onMarkAllAsRead}
              className="text-amber-400 font-semibold hover:underline"
            >
              {t.markAllRead}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
