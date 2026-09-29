import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  AlertDirection,
  AlertType,
  ExchangeName,
  AppSettings,
  SoundTone,
  CustomSoundItem,
  AlertProfilePreset,
  AlertProfilePresetId,
} from '../types/crypto';
import {
  EXCHANGES_CATALOG,
  POPULAR_CRYPTO_ASSETS,
  SUPPORTED_QUOTE_CURRENCIES,
  ALERT_PROFILE_PRESETS,
  formatCurrencyPrice,
  searchCryptoCatalog,
  CryptoAsset,
} from '../services/exchanges/symbolData';
import { ExchangeManager } from '../services/exchanges/exchangeManager';
import { audioService } from '../services/notifications/audioService';
import { getTranslation } from '../utils/i18n';
import {
  X,
  Check,
  Bell,
  TrendingUp,
  Percent,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Sparkles,
  Volume2,
  Mic,
  Activity,
  Search,
  Zap,
  Shield,
  AlertTriangle,
  Music,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface CreateAlertModalProps {
  isOpen: boolean;
  initialAlert?: Alert | null;
  prefill?: { exchange?: ExchangeName; symbol?: string; baseAsset?: string; quoteAsset?: string } | null;
  settings: AppSettings;
  onClose: () => void;
  onSave: (alertData: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>, existingId?: string) => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  isOpen,
  initialAlert,
  prefill,
  settings,
  onClose,
  onSave,
}) => {
  const t = getTranslation(settings.language);
  const exchangeManager = ExchangeManager.getInstance();

  const [exchange, setExchange] = useState<ExchangeName>('Binance');
  const [baseAsset, setBaseAsset] = useState<string>('BTC');
  const [quoteAsset, setQuoteAsset] = useState<string>('USDT');
  const [customBaseInput, setCustomBaseInput] = useState('');
  const [isCustomBase, setIsCustomBase] = useState(false);

  // Asset search & category filter state
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);

  const [type, setType] = useState<AlertType>('repeatingPercentage');
  const [direction, setDirection] = useState<AlertDirection>('both');
  const [targetValue, setTargetValue] = useState<number>(1.0);
  const [customNote, setCustomNote] = useState('');
  const [soundToneOverride, setSoundToneOverride] = useState<SoundTone>('classic');
  const [customSoundIdOverride, setCustomSoundIdOverride] = useState<string | undefined>(undefined);
  const [voiceAlertOverride, setVoiceAlertOverride] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<AlertProfilePresetId | null>('scalper');

  const [currentLivePrice, setCurrentLivePrice] = useState<number>(67000);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [customSoundsList, setCustomSoundsList] = useState<CustomSoundItem[]>([]);

  // Derived unified symbol
  const effectiveBase = isCustomBase ? customBaseInput.trim().toUpperCase() || 'BTC' : baseAsset;
  const combinedSymbol = `${effectiveBase}${quoteAsset}`;

  // Load custom sounds list on open
  useEffect(() => {
    if (isOpen) {
      setCustomSoundsList(audioService.getCustomSounds());
    }
  }, [isOpen]);

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    let list = searchCryptoCatalog(assetSearchQuery);
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'POPULAR') {
        list = list.filter((a) => a.isPopular);
      } else {
        list = list.filter((a) => a.category === selectedCategory);
      }
    }
    return list;
  }, [assetSearchQuery, selectedCategory]);

  // Selected coin asset info
  const selectedCoinInfo = useMemo(() => {
    return (
      POPULAR_CRYPTO_ASSETS.find(
        (a) => a.symbol.toUpperCase() === effectiveBase.toUpperCase()
      ) || {
        symbol: effectiveBase,
        name: effectiveBase,
        faName: effectiveBase,
        network: 'Multi-Chain',
        category: 'L1' as const,
      }
    );
  }, [effectiveBase]);

  // Initialize or reset form
  useEffect(() => {
    if (initialAlert) {
      setExchange(initialAlert.exchange);
      setType(initialAlert.type);
      setDirection(initialAlert.direction);
      setTargetValue(initialAlert.targetValue);
      setCustomNote(initialAlert.customNote || '');
      setSoundToneOverride(initialAlert.soundToneOverride || 'classic');
      setCustomSoundIdOverride(initialAlert.customSoundId);
      setVoiceAlertOverride(!!initialAlert.voiceAlertOverride);
      setActiveProfileId(null);

      if (initialAlert.baseAsset) {
        setBaseAsset(initialAlert.baseAsset);
      }
      if (initialAlert.quoteAsset) {
        setQuoteAsset(initialAlert.quoteAsset);
      }
    } else if (prefill) {
      if (prefill.exchange) setExchange(prefill.exchange);
      if (prefill.baseAsset) setBaseAsset(prefill.baseAsset);
      if (prefill.quoteAsset) setQuoteAsset(prefill.quoteAsset);
      setIsCustomBase(false);
      setCustomBaseInput('');
      setType('repeatingPercentage');
      setDirection('both');
      setTargetValue(0.75);
      setCustomNote('');
      setSoundToneOverride('classic');
      setCustomSoundIdOverride(undefined);
      setVoiceAlertOverride(false);
      setActiveProfileId('scalper');
    } else {
      setExchange('Binance');
      setBaseAsset('BTC');
      setQuoteAsset('USDT');
      setIsCustomBase(false);
      setCustomBaseInput('');
      setType('repeatingPercentage');
      setDirection('both');
      setTargetValue(0.75);
      setCustomNote('');
      setSoundToneOverride('classic');
      setCustomSoundIdOverride(undefined);
      setVoiceAlertOverride(false);
      setActiveProfileId('scalper');
    }
  }, [initialAlert, prefill, isOpen]);

  // Fetch current live price when symbol or exchange changes
  useEffect(() => {
    let isMounted = true;
    const updatePrice = async () => {
      const cached = exchangeManager.getPrice(exchange, combinedSymbol);
      if (cached && cached.price > 0) {
        if (isMounted) setCurrentLivePrice(cached.price);
        return;
      }
      setIsLoadingPrice(true);
      const fetched = await exchangeManager.fetchInstantPrice(exchange, combinedSymbol);
      if (isMounted && fetched && fetched > 0) {
        setCurrentLivePrice(fetched);
      }
      if (isMounted) setIsLoadingPrice(false);
    };

    updatePrice();
    return () => {
      isMounted = false;
    };
  }, [exchange, combinedSymbol]);

  if (!isOpen) return null;

  // Apply Alert Profile Preset
  const handleApplyProfile = (profile: AlertProfilePreset) => {
    setActiveProfileId(profile.id);
    setType(profile.type);
    setDirection(profile.direction);
    setTargetValue(profile.targetValue);
    setSoundToneOverride(profile.soundTone);
    setVoiceAlertOverride(profile.voiceAlert);
    const note = settings.language === 'fa' ? profile.descFa : profile.descEn;
    setCustomNote(note);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetValue <= 0) return;

    onSave(
      {
        exchange,
        symbol: combinedSymbol,
        baseAsset: effectiveBase,
        quoteAsset,
        type,
        targetValue: Number(targetValue),
        referencePrice: currentLivePrice,
        direction,
        isActive: true,
        hasUnreadTrigger: false,
        customNote: customNote.trim() || undefined,
        soundToneOverride,
        customSoundId: soundToneOverride === 'custom' ? customSoundIdOverride : undefined,
        voiceAlertOverride,
      },
      initialAlert?.id
    );
    onClose();
  };

  const handleTestSound = () => {
    audioService.playAlertSound(
      direction !== 'downOnly',
      type === 'priceTarget',
      settings.soundVolume,
      soundToneOverride,
      customSoundIdOverride
    );
    if (voiceAlertOverride) {
      audioService.speakAlert(`${effectiveBase} on ${exchange} reached target`, settings.language);
    }
  };

  const tonesList: { id: SoundTone; label: string }[] = [
    { id: 'classic', label: t.toneClassic },
    { id: 'radar', label: t.toneRadar },
    { id: 'crystal', label: t.toneCrystal },
    { id: 'chime', label: t.toneChime },
    { id: 'arcade', label: t.toneArcade },
    { id: 'cyber', label: t.toneCyber },
    { id: 'bell', label: t.toneBell },
    { id: 'siren', label: t.toneSiren },
    { id: 'emergency', label: t.toneEmergency },
    { id: 'ping', label: t.tonePing },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-7 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {initialAlert ? t.editAlert : t.newAlert}
              </h2>
              <p className="text-xs text-slate-400">
                Multi-exchange crypto checker with quick strategy presets & custom alarms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Section A: 1-Click Alert Profiles (Strategy Presets) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>{t.alertProfiles}</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">1-Click Auto Config</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {ALERT_PROFILE_PRESETS.map((profile) => {
                const isSelected = activeProfileId === profile.id;
                return (
                  <button
                    type="button"
                    key={profile.id}
                    onClick={() => handleApplyProfile(profile)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${profile.color} shadow-sm font-bold scale-[1.02]`
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs truncate w-full">
                      {settings.language === 'fa' ? profile.nameFa : profile.nameEn}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {settings.language === 'fa' ? profile.descFa : profile.descEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Exchange Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              1. {t.exchange}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
              {EXCHANGES_CATALOG.map((ex) => {
                const isSelected = exchange === ex.id;
                return (
                  <button
                    type="button"
                    key={ex.id}
                    onClick={() => {
                      setExchange(ex.id);
                      if (ex.id === 'Tabdeal' || ex.id === 'Nobitex') {
                        setQuoteAsset('TMN');
                      }
                    }}
                    className={`flex items-center justify-center py-2 px-1 rounded-xl text-xs font-medium font-mono transition-all ${
                      isSelected
                        ? `${ex.badgeBg} ${ex.color} border ${ex.badgeBorder} shadow-sm font-bold scale-[1.02]`
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{ex.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section C: English-First Universal Coin Search & Network Discovery */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>2. {t.baseAsset} (Universal English Crypto Search)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomBase(!isCustomBase);
                  setIsAssetDropdownOpen(false);
                }}
                className="text-[11px] text-amber-400 hover:underline font-medium"
              >
                {isCustomBase ? 'Back to Coin Catalog' : '+ Custom Ticker'}
              </button>
            </div>

            {isCustomBase ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={customBaseInput}
                  onChange={(e) => setCustomBaseInput(e.target.value)}
                  placeholder="Enter custom ticker (e.g. MONERO, SUI, KAS, GRASS, TRUMP)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white uppercase font-mono text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 block">
                  You can type any token ticker listed on {exchange}.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={assetSearchQuery}
                    onChange={(e) => {
                      setAssetSearchQuery(e.target.value);
                      setIsAssetDropdownOpen(true);
                    }}
                    onFocus={() => setIsAssetDropdownOpen(true)}
                    placeholder={t.searchCryptoPrompt}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {[
                    { id: 'ALL', label: t.allCategories },
                    { id: 'POPULAR', label: '🔥 Top 20' },
                    { id: 'L1', label: t.catL1 },
                    { id: 'Meme', label: t.catMeme },
                    { id: 'AI', label: t.catAI },
                    { id: 'DeFi', label: t.catDeFi },
                    { id: 'Gaming', label: t.catGaming },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Coin Grid Picker */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-900/60 rounded-xl border border-slate-800">
                  {filteredAssets.slice(0, 48).map((asset) => {
                    const isSelected = baseAsset === asset.symbol;
                    return (
                      <button
                        type="button"
                        key={asset.symbol}
                        onClick={() => {
                          setBaseAsset(asset.symbol);
                          setIsCustomBase(false);
                        }}
                        className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/50 text-white font-bold shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono font-bold text-xs text-amber-400">{asset.symbol}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {asset.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 truncate w-full mt-0.5">{asset.name}</div>
                        <div className="text-[9px] text-slate-500 font-mono truncate w-full mt-0.5">
                          {asset.network}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section D: Counter Currency (Quote Asset) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              3. {t.quoteAsset}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {SUPPORTED_QUOTE_CURRENCIES.slice(0, 6).map((q) => (
                <button
                  type="button"
                  key={q.code}
                  onClick={() => setQuoteAsset(q.code)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono border text-center transition-all ${
                    quoteAsset === q.code
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{q.code}</div>
                  <div className="text-[10px] text-slate-400">{q.symbol}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Benchmark Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span>Selected Pair:</span>
                <span className="text-amber-400 font-bold">{combinedSymbol}</span>
                <span>on</span>
                <span className="text-white font-semibold">{exchange}</span>
                <span className="text-xs text-slate-500">({selectedCoinInfo.network})</span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums flex items-center gap-2 mt-0.5">
                <span>{formatCurrencyPrice(currentLivePrice, quoteAsset)}</span>
                {isLoadingPrice && <Activity className="w-4 h-4 text-amber-400 animate-spin" />}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Live Feed
              </span>
            </div>
          </div>

          {/* Section E: Alert Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              4. {t.alertType}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'repeatingPercentage', label: t.typeRepeatingPct, icon: Percent },
                { id: 'priceTarget', label: t.typePriceTarget, icon: TrendingUp },
                { id: 'repeatingAbsolute', label: t.typeRepeatingAbs, icon: Sparkles },
                { id: 'trailingPeak', label: t.typeTrailingPeak, icon: Activity },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setType(item.id as AlertType);
                      setActiveProfileId(null);
                      if (item.id === 'priceTarget') {
                        setTargetValue(
                          direction === 'downOnly'
                            ? Math.round(currentLivePrice * 0.95 * 100) / 100
                            : Math.round(currentLivePrice * 1.05 * 100) / 100
                        );
                      } else if (item.id === 'repeatingPercentage') {
                        setTargetValue(1.0);
                      } else if (item.id === 'repeatingAbsolute') {
                        setTargetValue(Math.round(currentLivePrice * 0.02) || 50);
                      } else if (item.id === 'trailingPeak') {
                        setTargetValue(2.5);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section F: Direction Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              5. {t.direction}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both', label: t.dirBoth, icon: ArrowUpDown },
                { id: 'upOnly', label: t.dirUpOnly, icon: ArrowUp, color: 'text-emerald-400' },
                { id: 'downOnly', label: t.dirDownOnly, icon: ArrowDown, color: 'text-rose-400' },
              ].map((d) => {
                const Icon = d.icon;
                const isSelected = direction === d.id;
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => {
                      setDirection(d.id as AlertDirection);
                      setActiveProfileId(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${d.color || ''}`} />
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section G: Target Value Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              6. {t.targetValue} {type === 'repeatingPercentage' || type === 'trailingPeak' ? '(%)' : `(${quoteAsset})`}
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.00000001"
                required
                value={targetValue}
                onChange={(e) => {
                  setTargetValue(parseFloat(e.target.value) || 0);
                  setActiveProfileId(null);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                {type === 'repeatingPercentage' || type === 'trailingPeak' ? '%' : quoteAsset}
              </span>
            </div>

            {/* Smart Presets */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-400">Quick:</span>
              {type === 'repeatingPercentage' &&
                [0.5, 0.75, 1.0, 2.0, 5.0, 10.0].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => {
                      setTargetValue(val);
                      setActiveProfileId(null);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                  >
                    {val}%
                  </button>
                ))}
              {type === 'priceTarget' && (
                <>
                  <button
                    type="button"
                    onClick={() => setTargetValue(Math.round(currentLivePrice * 1.03 * 100) / 100)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400"
                  >
                    +3%
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetValue(Math.round(currentLivePrice * 1.05 * 100) / 100)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400"
                  >
                    +5%
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetValue(Math.round(currentLivePrice * 0.95 * 100) / 100)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-rose-400"
                  >
                    -5%
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Section H: Alarm Ringtone (Built-in + Custom Uploaded Sounds) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{t.soundTone}</span>
              </span>
              <button
                type="button"
                onClick={handleTestSound}
                className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{t.testSound} 🔊</span>
              </button>
            </div>

            {/* Built-in Tones */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {tonesList.map((toneItem) => (
                <button
                  type="button"
                  key={toneItem.id}
                  onClick={() => {
                    setSoundToneOverride(toneItem.id);
                    setCustomSoundIdOverride(undefined);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${
                    soundToneOverride === toneItem.id && !customSoundIdOverride
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate block">{toneItem.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Uploaded Sounds if any */}
            {customSoundsList.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-cyan-400 block mb-1.5 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5" />
                  <span>Custom Uploaded Ringtones:</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {customSoundsList.map((cs) => {
                    const isSelected = soundToneOverride === 'custom' && customSoundIdOverride === cs.id;
                    return (
                      <button
                        type="button"
                        key={cs.id}
                        onClick={() => {
                          setSoundToneOverride('custom');
                          setCustomSoundIdOverride(cs.id);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-mono border text-left transition-all truncate ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        🎵 {cs.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TTS Voice Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.voiceAlerts}</span>
              </label>
              <input
                type="checkbox"
                checked={voiceAlertOverride}
                onChange={(e) => setVoiceAlertOverride(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section I: Custom Memo / Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.customNote}
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialAlert ? t.updateAlert : t.saveAlert}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
