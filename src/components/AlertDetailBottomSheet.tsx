import React from 'react';
import { Alert, CoinPrice, AppSettings } from '../types/crypto';
import { ExchangeManager } from '../services/exchanges/exchangeManager';
import { formatCurrencyPrice, EXCHANGES_CATALOG } from '../services/exchanges/symbolData';
import { audioService } from '../services/notifications/audioService';
import { getTranslation } from '../utils/i18n';
import {
  X,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Edit3,
  Zap,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Copy,
  Volume2,
  Clock,
} from 'lucide-react';

interface AlertDetailBottomSheetProps {
  alert: Alert | null;
  price?: CoinPrice;
  settings: AppSettings;
  onClose: () => void;
  onEdit: (alert: Alert) => void;
  onClone: (id: string) => void;
  onToggleActive: (id: string) => void;
  onResetReference: (id: string) => void;
  onTestTrigger: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export const AlertDetailBottomSheet: React.FC<AlertDetailBottomSheetProps> = ({
  alert,
  price,
  settings,
  onClose,
  onEdit,
  onClone,
  onToggleActive,
  onResetReference,
  onTestTrigger,
  onDelete,
  onMarkAsRead,
}) => {
  if (!alert) return null;

  const t = getTranslation(settings.language);
  const currentPrice = price ? price.price : alert.referencePrice;
  const change24h = price ? price.change24h : 0;
  const isPositive = change24h >= 0;
  const quote = alert.quoteAsset || 'USDT';

  // Get live sparkline points
  const sparkline = ExchangeManager.getInstance().getSparkline(alert.exchange, alert.symbol);

  // Sparkline SVG path calculation
  const renderSparkline = () => {
    if (sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 300;
    const height = 60;

    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 10) - 5;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-16 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={isPositive ? '#34d399' : '#f87171'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const exMeta = EXCHANGES_CATALOG.find((e) => e.id === alert.exchange) || EXCHANGES_CATALOG[0];

  const handleTestTone = () => {
    const tone = alert.soundToneOverride || settings.soundTone || 'classic';
    audioService.playAlertSound(alert.direction !== 'downOnly', alert.type === 'priceTarget', settings.soundVolume, tone);
    if (alert.voiceAlertOverride || settings.voiceAlerts) {
      audioService.speakAlert(`${alert.symbol} alert on ${alert.exchange}`, settings.language);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black p-5 sm:p-6 animate-in slide-in-from-bottom duration-200">
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                !alert.isActive
                  ? 'bg-slate-600'
                  : alert.hasUnreadTrigger
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-lg font-bold font-mono text-white">{alert.symbol}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${exMeta.badgeBg} ${exMeta.color}`}>
              {alert.exchange}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price & Sparkline Banner */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-black font-mono text-white">
                {formatCurrencyPrice(currentPrice, quote)}
              </span>
              <span
                className={`ml-2 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                  isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {isPositive ? '+' : ''}
                {change24h.toFixed(2)}%
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live WebSocket</span>
          </div>

          {/* Sparkline chart */}
          <div className="py-2">{renderSparkline()}</div>

          {/* 24h High, Low, Volume metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 block">{t.high24h}</span>
              <span className="text-slate-200">{formatCurrencyPrice(price?.high24h || currentPrice * 1.03, quote)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.low24h}</span>
              <span className="text-slate-200">{formatCurrencyPrice(price?.low24h || currentPrice * 0.97, quote)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.vol24h}</span>
              <span className="text-slate-200">
                {price?.volume24h ? (price.volume24h > 1000 ? `${(price.volume24h / 1000).toFixed(1)}k` : price.volume24h) : '2.4M'}
              </span>
            </div>
          </div>
        </div>

        {/* Trigger Condition Details */}
        <div className="space-y-2 text-xs mb-5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">{t.alertType}</span>
            <span className="font-bold text-white capitalize">{alert.type}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">{t.targetValue}</span>
            <span className="font-mono font-bold text-amber-400">
              {alert.type === 'repeatingPercentage' || alert.type === 'trailingPeak'
                ? `${alert.targetValue}%`
                : formatCurrencyPrice(alert.targetValue, quote)}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">{t.referencePrice}</span>
            <span className="font-mono text-slate-200">{formatCurrencyPrice(alert.referencePrice, quote)}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">{t.triggersCount}</span>
            <span className="font-mono text-slate-200">{alert.triggerCount || 0} times</span>
          </div>

          {alert.customNote && (
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">{t.customNote}</span>
              <span className="text-slate-200 italic">{alert.customNote}</span>
            </div>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="space-y-2">
          {/* Top row: Mark read / Reset Baseline / Test Tone */}
          <div className="flex items-center gap-2">
            {alert.hasUnreadTrigger && (
              <button
                onClick={() => onMarkAsRead(alert.id)}
                className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.markRead}</span>
              </button>
            )}

            <button
              onClick={() => onResetReference(alert.id)}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.resetReference}</span>
            </button>

            <button
              onClick={handleTestTone}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              title="Test Alert Ringtone"
            >
              <Volume2 className="w-4 h-4" />
              <span>Tone</span>
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => onToggleActive(alert.id)}
              className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                alert.isActive
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {alert.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{alert.isActive ? t.pauseAlert : t.resumeAlert}</span>
            </button>

            <button
              onClick={() => onEdit(alert)}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.editAlert}</span>
            </button>

            <button
              onClick={() => onTestTrigger(alert.id)}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Test</span>
            </button>

            <button
              onClick={() => onDelete(alert.id)}
              className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.deleteAlert}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
