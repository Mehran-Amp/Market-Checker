import React, { useState, useRef, useEffect } from 'react';
import { ExchangeName, ExchangeStatus, AppSettings, AppLanguage } from '../types/crypto';
import { getTranslation, SUPPORTED_LANGUAGES } from '../utils/i18n';
import { EXCHANGES_CATALOG } from '../services/exchanges/symbolData';
import { Bell, Settings, Volume2, VolumeX, Radio, Code2, Globe, ChevronDown, Check, RefreshCw } from 'lucide-react';

interface HeaderProps {
  statuses: Record<ExchangeName, ExchangeStatus>;
  settings: AppSettings;
  unreadCount: number;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenFlutterExport: () => void;
  onToggleSound: () => void;
  onSelectLanguage: (lang: AppLanguage) => void;
  onOpenLanguageModal: () => void;
  onReconnectExchange: (exchange: ExchangeName) => void;
}

export const Header: React.FC<HeaderProps> = ({
  statuses,
  settings,
  unreadCount,
  onOpenSettings,
  onOpenNotifications,
  onOpenFlutterExport,
  onToggleSound,
  onSelectLanguage,
  onOpenLanguageModal,
  onReconnectExchange,
}) => {
  const t = getTranslation(settings.language);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isExchangeMenuOpen, setIsExchangeMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const exMenuRef = useRef<HTMLDivElement>(null);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === settings.language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (exMenuRef.current && !exMenuRef.current.contains(event.target as Node)) {
        setIsExchangeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getExchangeMeta = (name: ExchangeName) => {
    return EXCHANGES_CATALOG.find((e) => e.id === name) || EXCHANGES_CATALOG[0];
  };

  const topKeyExchanges: ExchangeName[] = ['Binance', 'Coinbase', 'Kraken', 'OKX', 'MEXC'];

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Live Pulse */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20">
            <Radio className="w-5 h-5 animate-pulse text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                Market
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono">
                Checker
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block max-w-xs truncate">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Zone 2: Exchange Status Telemetry (BitcoinChecker multi-exchange) */}
        <div className="hidden lg:flex items-center gap-2">
          {topKeyExchanges.map((ex) => {
            const status = statuses[ex];
            const meta = getExchangeMeta(ex);
            const isOnline = status?.status === 'connected';
            const isConnecting = status?.status === 'connecting';

            return (
              <button
                key={ex}
                onClick={() => onReconnectExchange(ex)}
                title={`${ex}: ${status?.status || 'active'} (${status?.pingMs || 25}ms) • Click to ping`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all hover:scale-105 active:scale-95 ${meta.color} ${meta.badgeBg} ${meta.badgeBorder}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-emerald-400 animate-pulse' : isConnecting ? 'bg-amber-400 animate-spin' : 'bg-rose-500'
                  }`}
                />
                <span className="font-semibold">{ex}</span>
                <span className="text-[10px] opacity-75 tabular-nums">
                  {isOnline ? `${status?.pingMs || 25}ms` : status?.status}
                </span>
              </button>
            );
          })}

          {/* All 15+ Exchanges Dropdown */}
          <div className="relative" ref={exMenuRef}>
            <button
              onClick={() => setIsExchangeMenuOpen(!isExchangeMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>+10</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isExchangeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  15+ Supported Exchanges
                </div>
                {EXCHANGES_CATALOG.map((ex) => {
                  const status = statuses[ex.id];
                  const isOnline = status?.status === 'connected';
                  return (
                    <button
                      key={ex.id}
                      onClick={() => {
                        onReconnectExchange(ex.id);
                        setIsExchangeMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        <span className="font-medium text-slate-200">{ex.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{status?.pingMs || 30}ms</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Flutter Code Button */}
          <button
            onClick={onOpenFlutterExport}
            title={t.flutterCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-mono">Flutter Dart</span>
          </button>

          {/* 7-Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800/60 transition-colors"
              title="Change Language"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">
                {currentLangObj.code}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 flex items-center justify-between">
                  <span>Languages</span>
                  <button
                    onClick={() => {
                      setIsLangMenuOpen(false);
                      onOpenLanguageModal();
                    }}
                    className="text-amber-400 hover:underline text-[10px]"
                  >
                    View All
                  </button>
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = settings.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 text-amber-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className={`p-2 rounded-lg border transition-all ${
              settings.soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Center with unread badge */}
          <button
            onClick={onOpenNotifications}
            title={t.notifications}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-slate-950 bg-amber-400 rounded-full shadow-md shadow-amber-500/40 animate-pulse font-mono">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            title={t.settings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
