import React, { useState, useEffect } from 'react';
import {
  MarketAsset,
  MarketType,
  MARKET_CATEGORIES,
  multiMarketService,
} from '../services/markets/multiMarketService';
import { AppSettings, ExchangeName } from '../types/crypto';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Flame,
  Zap,
  DollarSign,
  BarChart2,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { formatCurrencyPrice } from '../services/exchanges/symbolData';

interface MultiMarketExploreProps {
  settings: AppSettings;
  onQuickCreateAlert: (exchange: ExchangeName, symbol: string, baseAsset: string, quoteAsset: string) => void;
}

export const MultiMarketExplore: React.FC<MultiMarketExploreProps> = ({
  settings,
  onQuickCreateAlert,
}) => {
  const [selectedMarket, setSelectedMarket] = useState<MarketType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<MarketAsset[]>(multiMarketService.getAssets());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsub = multiMarketService.subscribe((list) => {
      setAssets(list);
    });
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await multiMarketService.refreshFeeds();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesMarket = selectedMarket === 'ALL' || asset.market === selectedMarket;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.faName.toLowerCase().includes(q) ||
      asset.categoryName.toLowerCase().includes(q) ||
      asset.faCategoryName.toLowerCase().includes(q);

    return matchesMarket && matchesSearch;
  });

  const getCategoryIcon = (market: MarketType) => {
    switch (market) {
      case 'forex':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'metals':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'energy':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'stocks':
        return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case 'indices':
        return <BarChart2 className="w-4 h-4 text-purple-400" />;
      case 'bonds':
        return <Landmark className="w-4 h-4 text-rose-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Search and Refresh Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              settings.language === 'fa'
                ? 'جستجوی نماد، طلا، نفت، فارکس، سهام (مثلاً: XAU, Brent, EUR, NVDA, سکه)...'
                : 'Search forex, gold, oil, equities, indices (e.g. XAU, Brent, EUR/USD, NVDA)...'
            }
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all"
          />
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span>{settings.language === 'fa' ? 'به‌روزرسانی نرخ‌ها' : 'Refresh Feeds'}</span>
        </button>
      </div>

      {/* Market Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedMarket('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
            selectedMarket === 'ALL'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {settings.language === 'fa' ? 'همه بازارها' : 'All Global Markets'} ({assets.length})
        </button>

        {MARKET_CATEGORIES.filter((c) => c.id !== 'crypto').map((cat) => {
          const isSelected = selectedMarket === cat.id;
          const count = assets.filter((a) => a.market === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedMarket(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                isSelected
                  ? `${cat.badgeColor} font-bold shadow-sm`
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{settings.language === 'fa' ? cat.faName : cat.name}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Quick Sector Filter Chips for Stocks & Markets */}
      {selectedMarket === 'stocks' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-500 font-mono shrink-0">
            {settings.language === 'fa' ? 'دسته‌های سهام:' : 'Sectors:'}
          </span>
          {[
            { labelFa: 'همه سهام', labelEn: 'All Stocks', query: '' },
            { labelFa: 'هوش مصنوعی و تراشه‌ها (AI & Chips)', labelEn: 'AI & Chips', query: 'NVDA' },
            { labelFa: 'غول‌های فناوری (Big Tech)', labelEn: 'Big Tech', query: 'Apple' },
            { labelFa: 'پراکسی بیت‌کوین و صرافی (Crypto Equities)', labelEn: 'Crypto Stocks', query: 'MicroStrategy' },
            { labelFa: 'خودرو و رباتیک (EV)', labelEn: 'EV & Auto', query: 'Tesla' },
            { labelFa: 'مالی و بانکی (Banking)', labelEn: 'Banking', query: 'JPMorgan' },
            { labelFa: 'داروسازی (Pharma)', labelEn: 'Pharma', query: 'Lilly' },
            { labelFa: 'هوافضا و دفاعی (Defense)', labelEn: 'Defense', query: 'Lockheed' },
            { labelFa: 'خرده‌فروشی (Retail)', labelEn: 'Retail', query: 'Walmart' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(chip.query)}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all whitespace-nowrap ${
                searchQuery === chip.query
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {settings.language === 'fa' ? chip.labelFa : chip.labelEn}
            </button>
          ))}
        </div>
      )}

      {selectedMarket === 'indices' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-500 font-mono shrink-0">
            {settings.language === 'fa' ? 'دسته‌بندی شاخص‌ها:' : 'Regions:'}
          </span>
          {[
            { labelFa: 'همه شاخص‌ها', labelEn: 'All Indices', query: '' },
            { labelFa: 'بورس آمریکا (S&P 500, Nasdaq, Dow)', labelEn: 'US Indices', query: 'Index' },
            { labelFa: 'شاخص ترس و نوسان (VIX)', labelEn: 'Volatility (VIX)', query: 'VIX' },
            { labelFa: 'شاخص ارزش دلار (DXY)', labelEn: 'Dollar DXY', query: 'DXY' },
            { labelFa: 'بورس‌های اروپا (DAX, FTSE, CAC)', labelEn: 'European', query: 'DAX' },
            { labelFa: 'بورس‌های آسیا (ژاپن، چین، هند)', labelEn: 'Asian', query: 'Nikkei' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(chip.query)}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all whitespace-nowrap ${
                searchQuery === chip.query
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {settings.language === 'fa' ? chip.labelFa : chip.labelEn}
            </button>
          ))}
        </div>
      )}

      {selectedMarket === 'bonds' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-500 font-mono shrink-0">
            {settings.language === 'fa' ? 'فیلتر اوراق:' : 'Bonds:'}
          </span>
          {[
            { labelFa: 'همه اوراق قرضه', labelEn: 'All Yields', query: '' },
            { labelFa: 'اوراق ۱۰ ساله و ۲ ساله آمریکا (US Yields)', labelEn: 'US Treasuries', query: 'US' },
            { labelFa: 'اوراق اروپا و آلمان (German Bund & UK Gilt)', labelEn: 'European Bonds', query: 'Bund' },
            { labelFa: 'اوراق دولتی آسیا (Japan JGB)', labelEn: 'Asia Bonds', query: 'Japan' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(chip.query)}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all whitespace-nowrap ${
                searchQuery === chip.query
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {settings.language === 'fa' ? chip.labelFa : chip.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAssets.map((asset) => {
          const isPositive = asset.change24h >= 0;
          return (
            <div
              key={asset.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-black/40 group flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Symbol & Category */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                      {getCategoryIcon(asset.market)}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-xs text-slate-400">
                        {settings.language === 'fa' ? asset.faName : asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {isPositive ? '+' : ''}
                      {asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="text-xl font-bold font-mono text-slate-100 tracking-tight">
                      {formatCurrencyPrice(asset.price, asset.quote)}
                      {asset.unit && (
                        <span className="text-xs font-normal text-slate-400 ml-1">
                          / {asset.unit}
                        </span>
                      )}
                    </div>

                    {asset.tomanPrice && asset.quote === 'USD' && (
                      <div className="text-xs text-amber-400 font-mono mt-0.5">
                        ≈ {asset.tomanPrice.toLocaleString('fa-IR')} تومان
                      </div>
                    )}
                  </div>

                  {/* 24h High / Low */}
                  <div className="text-right text-[11px] font-mono text-slate-500">
                    <div>
                      H: <span className="text-slate-300">{asset.high24h.toLocaleString()}</span>
                    </div>
                    <div>
                      L: <span className="text-slate-300">{asset.low24h.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Context and Fast Alert Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[170px]">
                  {settings.language === 'fa' ? asset.faCategoryName : asset.categoryName}
                </span>

                <button
                  onClick={() => {
                    const exchange: ExchangeName = asset.quote === 'TMN' ? 'Tabdeal' : 'CoinGecko';
                    onQuickCreateAlert(exchange, asset.symbol, asset.symbol.split('/')[0], asset.quote);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-all shadow-sm"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.language === 'fa' ? 'تنظیم هشدار' : 'Set Alert'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
