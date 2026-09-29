import React, { useState, useRef } from 'react';
import { AppSettings, AlertTriggerLog, AppTheme, SoundTone, VibrationPatternType, RefreshInterval } from '../types/crypto';
import { getTranslation, SUPPORTED_LANGUAGES } from '../utils/i18n';
import { audioService } from '../services/notifications/audioService';
import { notificationService } from '../services/notifications/notificationService';
import { ForegroundServiceState } from '../services/backgroundService/foregroundService';
import { AlertStorage } from '../services/alertEngine/alertStorage';
import { POPULAR_CRYPTO_ASSETS } from '../services/exchanges/symbolData';
import {
  X,
  Volume2,
  Bell,
  Shield,
  Moon,
  Sun,
  Smartphone,
  Radio,
  Trash2,
  Download,
  Upload,
  Globe,
  Check,
  Clock,
  Mic,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  logs: AlertTriggerLog[];
  serviceState: ForegroundServiceState;
  onClose: () => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearLogs: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  logs,
  onClose,
  onUpdateSettings,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(settings.language);
  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'service' | 'backup' | 'logs'>('general');
  const [notifPermissionState, setNotifPermissionState] = useState(notificationService.hasPermission());
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (partial: Partial<AppSettings>) => {
    onUpdateSettings({ ...settings, ...partial });
  };

  const handleRequestNotif = async () => {
    const granted = await notificationService.requestPermission();
    setNotifPermissionState(granted);
    if (granted) {
      notificationService.sendSystemNotification({
        id: 'test',
        alertId: 'test',
        symbol: 'BTCUSDT',
        exchange: 'Binance',
        timestamp: Date.now(),
        type: 'repeatingPercentage',
        direction: 'both',
        fromPrice: 67000,
        toPrice: 67670,
        targetValue: 1.0,
        changeAmount: 670,
        changePercentage: 1.0,
        title: 'Market Checker · Binance',
        message: '1% Price Increase ▲\n$67,000 → $67,670',
        read: true,
      });
    }
  };

  const handleExportBackup = () => {
    const jsonStr = AlertStorage.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market_checker_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus({ type: 'success', message: 'Backup file exported successfully!' });
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = AlertStorage.importFullBackup(content);
        if (success) {
          setBackupStatus({ type: 'success', message: t.backupSuccess });
          onUpdateSettings(AlertStorage.getSettings());
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setBackupStatus({ type: 'error', message: t.backupError });
        }
      } catch (err) {
        setBackupStatus({ type: 'error', message: t.backupError });
      }
    };
    reader.readAsText(file);
  };

  const handleExportLogsJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market_checker_logs_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tonesList: { id: SoundTone; label: string }[] = [
    { id: 'classic', label: t.toneClassic },
    { id: 'radar', label: t.toneRadar },
    { id: 'crystal', label: t.toneCrystal },
    { id: 'cyber', label: t.toneCyber },
    { id: 'bell', label: t.toneBell },
    { id: 'siren', label: t.toneSiren },
    { id: 'ping', label: t.tonePing },
  ];

  const intervalsList: { id: RefreshInterval; label: string }[] = [
    { id: 'realtime', label: t.intervalRealtime },
    { id: '5s', label: t.interval5s },
    { id: '15s', label: t.interval15s },
    { id: '30s', label: t.interval30s },
    { id: '1m', label: t.interval1m },
    { id: '5m', label: t.interval5m },
    { id: '15m', label: t.interval15m },
  ];

  const vibrationPatternsList: { id: VibrationPatternType; label: string }[] = [
    { id: 'single', label: t.vibSingle },
    { id: 'double', label: t.vibDouble },
    { id: 'long', label: t.vibLong },
    { id: 'sos', label: t.vibSos },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-7 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{t.settings}</h2>
              <p className="text-xs text-slate-400">{t.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 my-4 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
          {[
            { id: 'general', label: 'Language & Theme' },
            { id: 'audio', label: t.soundSettings },
            { id: 'service', label: 'Check Frequency & Ticker' },
            { id: 'backup', label: 'Backup (JSON)' },
            { id: 'logs', label: `${t.logs} (${logs.length})` },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isSelected ? 'bg-slate-800 text-amber-400 shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 text-sm">
          {/* 1. General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* 7 Languages Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Language / زبان / 语言 / Sprache / زمان / اللغة / Langue</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = settings.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => update({ language: lang.code })}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono text-slate-500">{lang.code}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">{t.theme}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark', label: t.themeDark, icon: Moon },
                    { id: 'midnight', label: t.themeMidnight, icon: Radio },
                    { id: 'light', label: t.themeLight, icon: Sun },
                  ].map((th) => {
                    const isSelected = settings.theme === th.id;
                    const Icon = th.icon;
                    return (
                      <button
                        key={th.id}
                        onClick={() => update({ theme: th.id as AppTheme })}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{th.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Browser Notifications */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-slate-200">{t.systemNotifications}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono ${
                      notifPermissionState ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {notifPermissionState ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Receive live browser notifications across 15+ exchanges even when minimized.
                </p>
                <button
                  onClick={handleRequestNotif}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>{notifPermissionState ? 'Send Test Notification' : t.requestPermission}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Audio & Notifications Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Sound Enabled */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-200">{t.soundEnabled}</div>
                    <div className="text-xs text-slate-400">Play alarm sound when price targets hit</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => update({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Volume Slider */}
              {settings.soundEnabled && (
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">{t.soundVolume}</span>
                    <span className="text-xs font-mono text-amber-400">{Math.round(settings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      update({ soundVolume: v });
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => audioService.playTestTone(settings.soundVolume, settings.soundTone)}
                      className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
                    >
                      {t.testSound} 🔊
                    </button>
                  </div>
                </div>
              )}

              {/* Tone Selection (BitcoinChecker Classic & Modern Tones) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">{t.soundTone}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tonesList.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => {
                        update({ soundTone: tone.id });
                        audioService.playTestTone(settings.soundVolume, tone.id);
                      }}
                      className={`p-2.5 text-xs rounded-xl border text-left transition-all ${
                        settings.soundTone === tone.id
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="truncate font-semibold">{tone.label}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{tone.id}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Alerts (TTS) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-slate-200">{t.voiceAlerts}</div>
                      <div className="text-xs text-slate-400">Speaks out the price announcement aloud</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.voiceAlerts}
                    onChange={(e) => update({ voiceAlerts: e.target.checked })}
                    className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
                {settings.voiceAlerts && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() =>
                        audioService.speakAlert('Market Checker: Bitcoin is 67,500 Dollars', settings.language)
                      }
                      className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
                    >
                      Test TTS Speech 🗣️
                    </button>
                  </div>
                )}
              </div>

              {/* Vibration & Vibration Patterns */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-slate-200">{t.vibration}</div>
                      <div className="text-xs text-slate-400">Haptic vibration feedback on mobile</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.vibration}
                    onChange={(e) => update({ vibration: e.target.checked })}
                    className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                  />
                </div>

                {settings.vibration && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{t.vibrationPattern}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {vibrationPatternsList.map((vp) => (
                        <button
                          key={vp.id}
                          onClick={() => {
                            update({ vibrationPattern: vp.id });
                            audioService.triggerVibration(vp.id);
                          }}
                          className={`p-2 rounded-xl text-xs border text-left transition-all ${
                            settings.vibrationPattern === vp.id
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="truncate">{vp.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Service & BitcoinChecker Ticker Tab */}
          {activeTab === 'service' && (
            <div className="space-y-4">
              {/* Check Frequency / Polling Interval (BitcoinChecker feature) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">{t.refreshInterval}</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Select how frequently Market Checker polls price updates and checks alert triggers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {intervalsList.map((int) => (
                    <button
                      key={int.id}
                      onClick={() => update({ refreshInterval: int.id })}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        settings.refreshInterval === int.id
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="truncate font-semibold">{int.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* BitcoinChecker Ongoing Notification Ticker Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">{t.ongoingTicker}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.ongoingNotificationEnabled}
                    onChange={(e) => update({ ongoingNotificationEnabled: e.target.checked })}
                    className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-400 mb-3">{t.ongoingTickerDesc}</p>

                {/* Coin selector */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">Primary Monitored Coin:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_CRYPTO_ASSETS.slice(0, 10).map((s) => (
                      <button
                        key={s.symbol}
                        onClick={() => update({ ongoingSymbol: `${s.symbol}USDT` })}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                          settings.ongoingSymbol === `${s.symbol}USDT`
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {s.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screen Wake Lock */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{t.wakeLock}</div>
                  <div className="text-xs text-slate-400">Keeps the screen awake for continuous live monitoring</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.wakeLockEnabled}
                  onChange={(e) => update({ wakeLockEnabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 4. Backup & Restore Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h4 className="font-bold text-white mb-1">{t.backupRestore}</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Export all your checkers, exchange preferences, and alarm settings into a JSON backup file.
                </p>

                {backupStatus && (
                  <div
                    className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                      backupStatus.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {backupStatus.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{t.exportBackup}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>{t.importBackup}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400">Total Trigger Logs: {logs.length}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportLogsJSON}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Logs</span>
                  </button>
                  <button
                    onClick={onClearLogs}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.clearLogs}</span>
                  </button>
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No alerts have triggered yet.</div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 font-bold font-mono text-white">
                          <span className="text-amber-400">{log.symbol}</span>
                          <span className="text-[10px] text-slate-500">({log.exchange})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-slate-300 font-medium">{log.title}</div>
                      <div className="text-slate-400 whitespace-pre-line text-[11px] mt-0.5">{log.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
