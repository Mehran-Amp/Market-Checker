export type ExchangeName =
  | 'Binance'
  | 'Coinbase'
  | 'Kraken'
  | 'OKX'
  | 'MEXC'
  | 'KuCoin'
  | 'Bybit'
  | 'Bitfinex'
  | 'Gate.io'
  | 'Bitstamp'
  | 'HTX'
  | 'Gemini'
  | 'Poloniex'
  | 'Bitget'
  | 'Tabdeal'
  | 'Nobitex'
  | 'CoinGecko';

export interface ExchangeMetadata {
  id: ExchangeName;
  name: string;
  category: 'global' | 'us' | 'europe' | 'asia' | 'iran' | 'aggregator';
  supportedQuotes: string[];
  hasWebSocket: boolean;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  website: string;
}

export interface CoinPrice {
  exchange: ExchangeName;
  symbol: string; // e.g. "BTCUSDT" or "BTC-USD"
  rawSymbol: string; // Exchange-specific symbol
  baseAsset?: string; // "BTC"
  quoteAsset?: string; // "USDT", "USD", "EUR", etc.
  price: number;
  change24h: number; // Percentage, e.g. 2.45
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: number;
  previousPrice?: number;
}

export interface SymbolInfo {
  symbol: string; // e.g. "BTCUSDT" or "BTC-USD"
  baseAsset: string; // "BTC"
  quoteAsset: string; // "USDT" or "USD"
  displayName: string; // "Bitcoin"
  faDisplayName?: string; // "بیت‌کوین"
  exchange: ExchangeName;
  network?: string; // "Bitcoin", "Ethereum (ERC-20)", "Solana (SPL)", "TON", etc.
  category?: 'L1' | 'L2' | 'DeFi' | 'Meme' | 'AI' | 'Gaming' | 'RWA' | 'DePIN' | 'Infra' | 'Forex' | 'Metals' | 'Energy' | 'Stocks' | 'Indices' | 'Bonds';
  isPopular?: boolean;
}

export type AlertType =
  | 'priceTarget'
  | 'repeatingPercentage'
  | 'repeatingAbsolute'
  | 'trailingPeak'
  | 'periodic';

export type AlertDirection = 'upOnly' | 'downOnly' | 'both';

export type SoundTone =
  | 'classic'
  | 'radar'
  | 'crystal'
  | 'cyber'
  | 'bell'
  | 'siren'
  | 'ping'
  | 'chime'
  | 'arcade'
  | 'emergency'
  | 'custom';

export interface CustomSoundItem {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: number;
}

export type AlertProfilePresetId =
  | 'scalper'
  | 'swing'
  | 'hodler'
  | 'crash_hunter'
  | 'volatility';

export interface AlertProfilePreset {
  id: AlertProfilePresetId;
  nameEn: string;
  nameFa: string;
  descEn: string;
  descFa: string;
  icon: string;
  type: AlertType;
  targetValue: number;
  direction: AlertDirection;
  soundTone: SoundTone;
  voiceAlert: boolean;
  color: string;
}

export type VibrationPatternType = 'single' | 'double' | 'long' | 'sos';

export type RefreshInterval = 'realtime' | '5s' | '15s' | '30s' | '1m' | '5m' | '15m';

export interface Alert {
  id: string;
  exchange: ExchangeName;
  symbol: string; // Standard or formatted symbol, e.g. "BTC/USDT" or "BTCUSDT"
  baseAsset?: string;
  quoteAsset?: string;
  type: AlertType;
  targetValue: number; // For priceTarget: target price. For repeatingPercentage: %. For repeatingAbsolute: $ delta. For trailingPeak: % drop.
  referencePrice: number; // Reference price at creation / last reset
  peakPrice?: number; // Highest price reached (for trailingPeak)
  troughPrice?: number; // Lowest price reached (for trailingDip)
  direction: AlertDirection;
  isActive: boolean;
  hasUnreadTrigger: boolean;
  createdAt: number;
  lastTriggeredAt?: number;
  lastTriggerPrice?: number;
  triggerCount: number;
  customNote?: string;
  snoozedUntil?: number; // timestamp until when alert is silenced
  soundToneOverride?: SoundTone;
  customSoundId?: string;
  voiceAlertOverride?: boolean;
}

export interface AlertTriggerLog {
  id: string;
  alertId: string;
  symbol: string;
  exchange: ExchangeName;
  timestamp: number;
  type: AlertType;
  direction: AlertDirection;
  fromPrice: number;
  toPrice: number;
  targetValue: number;
  changeAmount: number;
  changePercentage: number;
  title: string;
  message: string;
  read: boolean;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface ExchangeStatus {
  name: ExchangeName;
  status: ConnectionState;
  pingMs: number;
  subscribedCount: number;
  lastMessageAt: number;
  errorMessage?: string;
}

export type AppTheme = 'dark' | 'amoled' | 'midnight' | 'light';
export type AppLanguage = 'en' | 'zh' | 'de' | 'ku' | 'ar' | 'fr' | 'fa';

export interface LanguageInfo {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export interface AppSettings {
  theme: AppTheme;
  language: AppLanguage;
  hasChosenLanguage: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  soundTone: SoundTone;
  selectedCustomSoundId?: string;
  voiceAlerts: boolean;
  vibration: boolean;
  vibrationPattern: VibrationPatternType;
  notificationsEnabled: boolean;
  wakeLockEnabled: boolean;
  backgroundServiceActive: boolean;
  // BitcoinChecker inspired features:
  ongoingNotificationEnabled: boolean; // Sticky top ticker
  ongoingSymbol: string;
  ongoingExchange: ExchangeName;
  refreshInterval: RefreshInterval;
}
