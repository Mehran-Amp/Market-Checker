import React, { useState } from 'react';
import { Alert, CoinPrice, ExchangeName, AppSettings } from '../types/crypto';
import { getTranslation } from '../utils/i18n';
import { EXCHANGES_CATALOG, formatCurrencyPrice } from '../services/exchanges/symbolData';
import { ExchangeManager } from '../services/exchanges/exchangeManager';
import { MultiMarketExplore } from './MultiMarketExplore';
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Bell,
  CheckCheck,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Copy,
  Clock,
  Volume2,
  SlidersHorizontal,
  Globe2,
  Layers,
} from 'lucide-react';

interface WatchlistScreenProps {
  alerts: Alert[];
  prices: Record<string, CoinPrice>; // key: `${exchange}_${symbol}`
  settings: AppSettings;
  onOpenCreate: (prefill?: { exchange?: ExchangeName; symbol?: string; baseAsset?: string; quoteAsset?: string }) => void;
  onSelectAlert: (alert: Alert) => void;
  onToggleActive: (id: string, e: React.MouseEvent) => void;
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
  onResetReference: (id: string, e: React.MouseEvent) => void;
  onCloneAlert: (id: string, e: React.MouseEvent) => void;
  onDeleteAlert: (id: string, e: React.MouseEvent) => void;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  alerts,
  prices,
  settings,
  onOpenCreate,
  onSelectAlert,
  onToggleActive,
  onMarkAsRead,
  onResetReference,
  onCloneAlert,
  onDeleteAlert,
}) => {
  const t = getTranslation(settings.language);
  const [activeView, setActiveView] = useState<'alerts' | 'globalMarkets'>('alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unread' | 'paused'>('all');
  const [exchangeFilter, setExchangeFilter] = useState<ExchangeName | 'ALL'>('ALL');

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.exchange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.baseAsset && alert.baseAsset.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.customNote && alert.customNote.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? alert.isActive
        : statusFilter === 'unread'
        ? alert.hasUnreadTrigger
        : !alert.isActive;

    const matchesExchange = exchangeFilter === 'ALL' || alert.exchange === exchangeFilter;

    return matchesSearch && matchesStatus && matchesExchange;
  });

  const activeCount = alerts.filter((a) => a.isActive).length;
  const unreadCount = alerts.filter((a) => a.hasUnreadTrigger).length;

  const getRuleDescription = (alert: Alert) => {
    const quote = alert.quoteAsset || 'USDT';
    switch (alert.type) {
      case 'priceTarget':
        return `${t.typePriceTarget}: ${formatCurrencyPrice(alert.targetValue, quote)} (${
          alert.direction === 'upOnly' ? t.dirUpOnly : alert.direction === 'downOnly' ? t.dirDownOnly : t.dirBoth
        })`;
      case 'repeatingPercentage':
        return `${t.typeRepeatingPct}: ${alert.targetValue}% · Baseline: ${formatCurrencyPrice(
          alert.referencePrice,
          quote
        )}`;
      case 'repeatingAbsolute':
        return `${t.typeRepeatingAbs}: ${formatCurrencyPrice(alert.targetValue, quote)} · Baseline: ${formatCurrencyPrice(
          alert.referencePrice,
          quote
        )}`;
      case 'trailingPeak':
        return `${t.typeTrailingPeak}: ${alert.targetValue}% from High/Low`;
      case 'periodic':
        return `${t.typePeriodic}`;
      default:
        return '';
    }
  };

  const getExchangeMeta = (name: ExchangeName) => {
    return EXCHANGES_CATALOG.find((e) => e.id === name) || EXCHANGES_CATALOG[0];
  };

  // Sparkline renderer for card
  const renderCardSparkline = (exchange: ExchangeName, symbol: string, isUp: boolean) => {
    const sparkline = ExchangeManager.getInstance().getSparkline(exchange, symbol);
    if (sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 120;
    const height = 32;

    const points = sparkline
      .map((val: number, idx: number) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-24 h-7 overflow-visible opacity-75" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={isUp ? '#34d399' : '#f87171'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:px-6 pb-28">
      {/* Primary Market Mode Switcher (Zero-pill, clean segmented tabs) */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveView('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'alerts'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{settings.language === 'fa' ? 'هشدارهای من' : 'My Active Alerts'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeView === 'alerts' ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-400'}`}>
              {alerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('globalMarkets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'globalMarkets'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>{settings.language === 'fa' ? 'فارکس، طلا، نفت و سهام جهانی' : 'Forex, Metals, Oil & Stocks'}</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </button>
        </div>

        <button
          onClick={() => onOpenCreate()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:opacity-95 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.newAlert}</span>
        </button>
      </div>

      {activeView === 'globalMarkets' ? (
        <MultiMarketExplore
          settings={settings}
          onQuickCreateAlert={(exchange, symbol, baseAsset, quoteAsset) => {
            onOpenCreate({ exchange, symbol, baseAsset, quoteAsset });
          }}
        />
      ) : (
        <>
          {/* Top Stat Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium mb-1">{t.activeAlerts}</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums flex items-center justify-between">
                <span>{activeCount}</span>
                <Zap className="w-5 h-5 text-emerald-400/60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium mb-1">{t.unreadAlerts}</div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums flex items-center justify-between">
                <span>{unreadCount}</span>
                <Bell className="w-5 h-5 text-amber-400/60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium mb-1">{t.monitoredPairs}</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums flex items-center justify-between">
                <span>{alerts.length}</span>
                <TrendingUp className="w-5 h-5 text-cyan-400/60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium mb-1">{t.refreshInterval}</div>
              <div className="text-lg font-bold font-mono text-slate-200 tabular-nums flex items-center justify-between">
                <span className="capitalize">{settings.refreshInterval}</span>
                <Clock className="w-5 h-5 text-slate-400/60" />
              </div>
            </div>
          </div>

          {/* Control Bar: Search + Filter Tabs + New Alert Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium">
              {(['all', 'active', 'unread', 'paused'] as const).map((filter) => {
                const isSelected = statusFilter === filter;
                const label =
                  filter === 'all'
                    ? t.filterAll
                    : filter === 'active'
                    ? t.filterActive
                    : filter === 'unread'
                    ? t.filterUnread
                    : t.filterPaused;

                return (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

      {/* Exchange Filter Row (All 15+ BitcoinChecker Exchanges) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <button
          onClick={() => setExchangeFilter('ALL')}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
            exchangeFilter === 'ALL'
              ? 'bg-white text-slate-950 font-bold shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ALL ({EXCHANGES_CATALOG.length})
        </button>

        {EXCHANGES_CATALOG.map((ex) => {
          const isSelected = exchangeFilter === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => setExchangeFilter(ex.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                isSelected
                  ? `${ex.badgeBg} ${ex.color} border ${ex.badgeBorder} font-bold`
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {ex.name}
            </button>
          );
        })}
      </div>

      {/* Checkers List / Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">{t.noAlertsFound}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">{t.noAlertsSub}</p>
          <button
            onClick={() => onOpenCreate()}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newAlert}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlerts.map((alert) => {
            const currentPriceObj = prices[`${alert.exchange}_${alert.symbol}`];
            const currentPrice = currentPriceObj ? currentPriceObj.price : alert.referencePrice;
            const change24h = currentPriceObj ? currentPriceObj.change24h : 0;
            const is24hUp = change24h >= 0;
            const quote = alert.quoteAsset || 'USDT';

            const exMeta = getExchangeMeta(alert.exchange);

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`group relative rounded-2xl p-4.5 transition-all cursor-pointer border ${
                  alert.hasUnreadTrigger
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : alert.isActive
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Card Top: Exchange Badge + Symbol + Status Indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${exMeta.badgeBg} ${exMeta.color} ${exMeta.badgeBorder}`}
                    >
                      {alert.exchange}
                    </span>
                    <span className="font-extrabold text-white text-base tracking-tight font-mono">
                      {alert.symbol}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {alert.hasUnreadTrigger && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                        <Bell className="w-3 h-3" />
                        <span>Triggered</span>
                      </span>
                    )}

                    <span
                      className={`w-2 h-2 rounded-full ${
                        !alert.isActive
                          ? 'bg-slate-600'
                          : alert.hasUnreadTrigger
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Card Middle: Live Price + 24h Change Badge + Sparkline */}
                <div className="flex items-end justify-between gap-3 mb-3">
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums tracking-tight">
                      {formatCurrencyPrice(currentPrice, quote)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`flex items-center gap-0.5 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          is24hUp
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {is24hUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{is24hUp ? '+' : ''}{change24h.toFixed(2)}%</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">24h</span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="hidden sm:block">
                    {renderCardSparkline(alert.exchange, alert.symbol, is24hUp)}
                  </div>
                </div>

                {/* Rule Description & Baseline */}
                <div className="text-xs text-slate-300 font-medium pb-3 border-b border-slate-800/80">
                  <div className="truncate">{getRuleDescription(alert)}</div>
                  {alert.customNote && (
                    <div className="text-[11px] text-slate-400 italic mt-0.5 truncate">
                      Memo: {alert.customNote}
                    </div>
                  )}
                </div>

                {/* Card Footer: Controls */}
                <div className="flex items-center justify-between pt-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span>Triggers: {alert.triggerCount || 0}</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {/* Mark read button if unread */}
                    {alert.hasUnreadTrigger && (
                      <button
                        onClick={(e) => onMarkAsRead(alert.id, e)}
                        title={t.markRead}
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Reset Baseline button */}
                    <button
                      onClick={(e) => onResetReference(alert.id, e)}
                      title={t.resetReference}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Clone alert */}
                    <button
                      onClick={(e) => onCloneAlert(alert.id, e)}
                      title={t.cloneAlert}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle pause/resume */}
                    <button
                      onClick={(e) => onToggleActive(alert.id, e)}
                      title={alert.isActive ? t.pauseAlert : t.resumeAlert}
                      className={`p-1.5 rounded-lg ${
                        alert.isActive
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {alert.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => onDeleteAlert(alert.id, e)}
                      title={t.deleteAlert}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};
