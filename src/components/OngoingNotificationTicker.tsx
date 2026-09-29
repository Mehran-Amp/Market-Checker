import React, { useState } from 'react';
import { CoinPrice, ExchangeName, AppSettings } from '../types/crypto';
import { getTranslation } from '../utils/i18n';
import {
  EXCHANGES_CATALOG,
  POPULAR_CRYPTO_ASSETS,
  formatCurrencyPrice,
} from '../services/exchanges/symbolData';
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Check,
} from 'lucide-react';

interface OngoingNotificationTickerProps {
  prices: Record<string, CoinPrice>;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onReconnectExchange: (exchange: ExchangeName) => void;
}

export const OngoingNotificationTicker: React.FC<OngoingNotificationTickerProps> = ({
  prices,
  settings,
  onUpdateSettings,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSelectingCoin, setIsSelectingCoin] = useState(false);

  if (!settings.ongoingNotificationEnabled) return null;

  const t = getTranslation(settings.language);
  const currentKey = `${settings.ongoingExchange}_${settings.ongoingSymbol}`;
  const priceObj = prices[currentKey];
  const price = priceObj?.price || 67200;
  const change24h = priceObj?.change24h || 0;
  const high24h = priceObj?.high24h;
  const low24h = priceObj?.low24h;
  const isPositive = change24h >= 0;

  const quote = priceObj?.quoteAsset || 'USDT';

  const handleSelectCoin = (symbol: string, ex: ExchangeName) => {
    onUpdateSettings({
      ...settings,
      ongoingSymbol: symbol,
      ongoingExchange: ex,
    });
    setIsSelectingCoin(false);
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-amber-500/20 backdrop-blur-md px-4 py-2.5 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Ongoing Android Notification Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ongoing Ticker (BitcoinChecker)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setIsSelectingCoin(!isSelectingCoin)}
                  className="font-bold text-white hover:text-amber-400 underline decoration-dotted transition-colors flex items-center gap-1"
                  title="Click to change ongoing ticker coin"
                >
                  <span>{settings.ongoingSymbol}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({settings.ongoingExchange})</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick toggle minimize on mobile */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center: Live Price & Ticker Metrics */}
        {!isMinimized && (
          <div className="flex flex-wrap items-center justify-between md:justify-center gap-3 sm:gap-6 w-full md:w-auto text-xs font-mono">
            {/* Live Price with glowing tick */}
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-extrabold text-white tabular-nums tracking-tight">
                {formatCurrencyPrice(price, quote)}
              </span>
              <span
                className={`flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>
                  {isPositive ? '+' : ''}
                  {change24h.toFixed(2)}%
                </span>
              </span>
            </div>

            {/* High / Low 24h */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
              {high24h && (
                <span>
                  H: <span className="text-slate-200">{formatCurrencyPrice(high24h, quote)}</span>
                </span>
              )}
              {low24h && (
                <span>
                  L: <span className="text-slate-200">{formatCurrencyPrice(low24h, quote)}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right: Quick Exchange Switcher or Hide button */}
        {!isMinimized && (
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sticky Notification</span>
          </div>
        )}
      </div>

      {/* Coin & Exchange Quick Switcher Dropdown */}
      {isSelectingCoin && (
        <div className="max-w-7xl mx-auto mt-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-xs font-bold text-slate-300 mb-2">
            Select Favorite Pair for Sticky Ongoing Notification:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto">
            {POPULAR_CRYPTO_ASSETS.slice(0, 12).map((coin) => {
              const sym = `${coin.symbol}USDT`;
              const isSelected = settings.ongoingSymbol === sym;
              return (
                <button
                  key={coin.symbol}
                  onClick={() => handleSelectCoin(sym, 'Binance')}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono text-left border transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold">{coin.symbol}</span>
                    <span className="text-[10px] text-slate-500 ml-1">USDT</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
