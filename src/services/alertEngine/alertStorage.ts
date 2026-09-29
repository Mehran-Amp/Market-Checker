import { Alert, AlertTriggerLog, AppSettings } from '../../types/crypto';

const ALERTS_STORAGE_KEY = 'crypto_alerts_hive_box';
const LOGS_STORAGE_KEY = 'crypto_alert_logs_hive_box';
const SETTINGS_STORAGE_KEY = 'crypto_settings_hive_box';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'en',
  hasChosenLanguage: false,
  soundEnabled: true,
  soundVolume: 0.8,
  soundTone: 'classic',
  voiceAlerts: false,
  vibration: true,
  vibrationPattern: 'double',
  notificationsEnabled: true,
  wakeLockEnabled: true,
  backgroundServiceActive: true,
  ongoingNotificationEnabled: true,
  ongoingSymbol: 'BTCUSDT',
  ongoingExchange: 'Binance',
  refreshInterval: 'realtime',
};

const DEFAULT_ALERTS: Alert[] = [
  {
    id: 'alert-btc-01',
    exchange: 'Binance',
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'repeatingPercentage',
    targetValue: 1.0, // 1%
    referencePrice: 67200,
    direction: 'both',
    isActive: true,
    hasUnreadTrigger: false,
    createdAt: Date.now() - 3600000 * 2,
    triggerCount: 1,
    lastTriggeredAt: Date.now() - 3600000,
    lastTriggerPrice: 67880,
    customNote: 'Bitcoin 1% scalp & volatility pulse',
  },
  {
    id: 'alert-eth-02',
    exchange: 'Coinbase',
    symbol: 'ETH-USD',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    type: 'priceTarget',
    targetValue: 3600,
    referencePrice: 3450,
    direction: 'upOnly',
    isActive: true,
    hasUnreadTrigger: false,
    createdAt: Date.now() - 3600000 * 5,
    triggerCount: 0,
    customNote: 'Ethereum resistance target on Coinbase',
  },
  {
    id: 'alert-sol-03',
    exchange: 'Kraken',
    symbol: 'SOL/USD',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    type: 'trailingPeak',
    targetValue: 2.5, // 2.5% reversal
    referencePrice: 154,
    direction: 'both',
    isActive: true,
    hasUnreadTrigger: false,
    createdAt: Date.now() - 3600000 * 8,
    triggerCount: 0,
    customNote: 'Solana 2.5% trailing peak reversal (BitcoinChecker style)',
  },
];

export class AlertStorage {
  public static getAllAlerts(): Alert[] {
    try {
      const data = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(DEFAULT_ALERTS));
        return DEFAULT_ALERTS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_ALERTS;
    }
  }

  public static getActiveAlerts(): Alert[] {
    return this.getAllAlerts().filter(a => a.isActive);
  }

  public static getAlert(id: string): Alert | undefined {
    return this.getAllAlerts().find(a => a.id === id);
  }

  public static saveAllAlerts(alerts: Alert[]) {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {}
  }

  public static addAlert(alert: Alert): Alert {
    const alerts = this.getAllAlerts();
    alerts.unshift(alert);
    this.saveAllAlerts(alerts);
    return alert;
  }

  public static updateAlert(updated: Alert): Alert {
    const alerts = this.getAllAlerts();
    const idx = alerts.findIndex(a => a.id === updated.id);
    if (idx !== -1) {
      alerts[idx] = updated;
      this.saveAllAlerts(alerts);
    }
    return updated;
  }

  public static deleteAlert(id: string) {
    const alerts = this.getAllAlerts().filter(a => a.id !== id);
    this.saveAllAlerts(alerts);
  }

  public static markAsRead(id: string) {
    const alerts = this.getAllAlerts();
    const target = alerts.find(a => a.id === id);
    if (target && target.hasUnreadTrigger) {
      target.hasUnreadTrigger = false;
      this.saveAllAlerts(alerts);
    }
  }

  public static markAllAsRead() {
    const alerts = this.getAllAlerts().map(a => ({ ...a, hasUnreadTrigger: false }));
    this.saveAllAlerts(alerts);
  }

  // --- Logs Box ---
  public static getLogs(): AlertTriggerLog[] {
    try {
      const data = localStorage.getItem(LOGS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  public static addLog(log: AlertTriggerLog) {
    try {
      const logs = this.getLogs();
      logs.unshift(log);
      if (logs.length > 200) logs.pop();
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {}
  }

  public static clearLogs() {
    localStorage.removeItem(LOGS_STORAGE_KEY);
  }

  public static markLogsAsRead() {
    const logs = this.getLogs().map(l => ({ ...l, read: true }));
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }

  // --- Settings Box ---
  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        hasChosenLanguage: Boolean(parsed.hasChosenLanguage),
        language: parsed.hasChosenLanguage ? (parsed.language || 'en') : 'en',
      };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  // --- BitcoinChecker Backup & Restore ---
  public static exportFullBackup(): string {
    let customSounds = [];
    try {
      const raw = localStorage.getItem('crypto_custom_sounds_hive');
      customSounds = raw ? JSON.parse(raw) : [];
    } catch (e) {}

    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      source: 'Market Checker (BitcoinChecker Engine)',
      alerts: this.getAllAlerts(),
      settings: this.getSettings(),
      logs: this.getLogs(),
      customSounds
    };
    return JSON.stringify(backup, null, 2);
  }

  public static importFullBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.alerts)) {
        this.saveAllAlerts(parsed.alerts);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }
      if (Array.isArray(parsed.logs)) {
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(parsed.logs));
      }
      if (Array.isArray(parsed.customSounds)) {
        localStorage.setItem('crypto_custom_sounds_hive', JSON.stringify(parsed.customSounds));
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
