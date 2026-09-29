import { SymbolInfo, ExchangeName, ExchangeMetadata, AlertProfilePreset } from '../../types/crypto';

export interface QuoteCurrency {
  code: string;
  name: string;
  faName: string;
  symbol: string;
  isFiat: boolean;
}

export const SUPPORTED_QUOTE_CURRENCIES: QuoteCurrency[] = [
  { code: 'TMN', name: 'Iranian Toman', faName: 'تومان ایران', symbol: 'تومان', isFiat: true },
  { code: 'USDT', name: 'Tether USD', faName: 'تتر دلار', symbol: '$', isFiat: false },
  { code: 'USD', name: 'US Dollar', faName: 'دلار آمریکا', symbol: '$', isFiat: true },
  { code: 'EUR', name: 'Euro', faName: 'یورو', symbol: '€', isFiat: true },
  { code: 'IRT', name: 'Iranian Toman (IRT)', faName: 'تومان (IRT)', symbol: 'تومان', isFiat: true },
  { code: 'USDC', name: 'USD Coin', faName: 'یو اس دی کوین', symbol: '$', isFiat: false },
  { code: 'GBP', name: 'British Pound', faName: 'پوند انگلیس', symbol: '£', isFiat: true },
  { code: 'JPY', name: 'Japanese Yen', faName: 'ین ژاپن', symbol: '¥', isFiat: true },
  { code: 'CAD', name: 'Canadian Dollar', faName: 'دلار کانادا', symbol: 'C$', isFiat: true },
  { code: 'AUD', name: 'Australian Dollar', faName: 'دلار استرالیا', symbol: 'A$', isFiat: true },
  { code: 'CHF', name: 'Swiss Franc', faName: 'فرانک سوئیس', symbol: 'Fr', isFiat: true },
  { code: 'CNY', name: 'Chinese Yuan', faName: 'یوان چین', symbol: '¥', isFiat: true },
  { code: 'INR', name: 'Indian Rupee', faName: 'روپیه هند', symbol: '₹', isFiat: true },
  { code: 'TRY', name: 'Turkish Lira', faName: 'لیر ترکیه', symbol: '₺', isFiat: true },
  { code: 'BRL', name: 'Brazilian Real', faName: 'رئال برزیل', symbol: 'R$', isFiat: true },
  { code: 'RUB', name: 'Russian Ruble', faName: 'روبل روسیه', symbol: '₽', isFiat: true },
  { code: 'KRW', name: 'South Korean Won', faName: 'وون کره جنوبی', symbol: '₩', isFiat: true },
  { code: 'AED', name: 'UAE Dirham', faName: 'درهم امارات', symbol: 'د.إ', isFiat: true },
  { code: 'IRR', name: 'Iranian Rial', faName: 'ریال ایران', symbol: 'ریال', isFiat: true },
  { code: 'BTC', name: 'Bitcoin', faName: 'بیت‌کوین', symbol: '₿', isFiat: false },
  { code: 'ETH', name: 'Ethereum', faName: 'اتریوم', symbol: 'Ξ', isFiat: false },
];

export const EXCHANGES_CATALOG: ExchangeMetadata[] = [
  {
    id: 'Binance',
    name: 'Binance',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC', 'USD', 'EUR', 'TRY', 'BRL', 'BTC', 'ETH'],
    hasWebSocket: true,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    website: 'https://binance.com'
  },
  {
    id: 'Coinbase',
    name: 'Coinbase',
    category: 'us',
    supportedQuotes: ['USD', 'EUR', 'GBP', 'USDT', 'BTC'],
    hasWebSocket: true,
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    website: 'https://coinbase.com'
  },
  {
    id: 'Kraken',
    name: 'Kraken',
    category: 'us',
    supportedQuotes: ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'USDT'],
    hasWebSocket: true,
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    website: 'https://kraken.com'
  },
  {
    id: 'OKX',
    name: 'OKX',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC', 'USD', 'EUR', 'BTC'],
    hasWebSocket: true,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    website: 'https://okx.com'
  },
  {
    id: 'MEXC',
    name: 'MEXC Global',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC'],
    hasWebSocket: true,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    website: 'https://mexc.com'
  },
  {
    id: 'KuCoin',
    name: 'KuCoin',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC', 'EUR', 'BTC'],
    hasWebSocket: true,
    color: 'text-teal-400',
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/30',
    website: 'https://kucoin.com'
  },
  {
    id: 'Bybit',
    name: 'Bybit',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC', 'EUR'],
    hasWebSocket: true,
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10',
    badgeBorder: 'border-yellow-500/30',
    website: 'https://bybit.com'
  },
  {
    id: 'Bitfinex',
    name: 'Bitfinex',
    category: 'global',
    supportedQuotes: ['USD', 'USDT', 'EUR', 'GBP', 'JPY'],
    hasWebSocket: true,
    color: 'text-green-400',
    badgeBg: 'bg-green-500/10',
    badgeBorder: 'border-green-500/30',
    website: 'https://bitfinex.com'
  },
  {
    id: 'Gate.io',
    name: 'Gate.io',
    category: 'global',
    supportedQuotes: ['USDT', 'USD', 'BTC'],
    hasWebSocket: true,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    website: 'https://gate.io'
  },
  {
    id: 'Bitstamp',
    name: 'Bitstamp',
    category: 'europe',
    supportedQuotes: ['USD', 'EUR', 'GBP', 'BTC'],
    hasWebSocket: true,
    color: 'text-lime-400',
    badgeBg: 'bg-lime-500/10',
    badgeBorder: 'border-lime-500/30',
    website: 'https://bitstamp.net'
  },
  {
    id: 'HTX',
    name: 'HTX (Huobi)',
    category: 'asia',
    supportedQuotes: ['USDT', 'USD', 'BTC'],
    hasWebSocket: true,
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/30',
    website: 'https://htx.com'
  },
  {
    id: 'Gemini',
    name: 'Gemini',
    category: 'us',
    supportedQuotes: ['USD', 'EUR', 'GBP', 'SGD'],
    hasWebSocket: true,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    website: 'https://gemini.com'
  },
  {
    id: 'Poloniex',
    name: 'Poloniex',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC', 'BTC'],
    hasWebSocket: true,
    color: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    website: 'https://poloniex.com'
  },
  {
    id: 'Bitget',
    name: 'Bitget',
    category: 'global',
    supportedQuotes: ['USDT', 'USDC', 'USD', 'EUR'],
    hasWebSocket: true,
    color: 'text-blue-500',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    website: 'https://bitget.com'
  },
  {
    id: 'Tabdeal',
    name: 'Tabdeal (تبدیل)',
    category: 'iran',
    supportedQuotes: ['TMN', 'IRT', 'USDT', 'IRR'],
    hasWebSocket: false,
    color: 'text-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/40',
    website: 'https://tabdeal.org'
  },
  {
    id: 'Nobitex',
    name: 'Nobitex (نوبیتکس)',
    category: 'iran',
    supportedQuotes: ['TMN', 'IRT', 'USDT', 'IRR'],
    hasWebSocket: false,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/40',
    website: 'https://nobitex.ir'
  },
  {
    id: 'CoinGecko',
    name: 'CoinGecko (Aggregator)',
    category: 'aggregator',
    supportedQuotes: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'TRY', 'BRL', 'RUB', 'KRW', 'AED', 'IRR', 'USDT', 'BTC', 'ETH'],
    hasWebSocket: false,
    color: 'text-green-500',
    badgeBg: 'bg-green-500/10',
    badgeBorder: 'border-green-500/30',
    website: 'https://coingecko.com'
  }
];

export interface CryptoAsset {
  symbol: string; // e.g. "BTC"
  name: string; // "Bitcoin"
  faName: string; // "بیت‌کوین"
  coingeckoId: string;
  network: string; // e.g. "Bitcoin", "Forex Spot", "Metals Market", "Energy & Oil", "US Equity"
  category: 'L1' | 'L2' | 'DeFi' | 'Meme' | 'AI' | 'Gaming' | 'RWA' | 'DePIN' | 'Infra' | 'Forex' | 'Metals' | 'Energy' | 'Stocks' | 'Indices' | 'Bonds';
  isPopular?: boolean;
}

export const POPULAR_CRYPTO_ASSETS: CryptoAsset[] = [
  // Forex & Global Currencies
  { symbol: 'EUR', name: 'Euro / USD', faName: 'یورو', coingeckoId: 'euro', network: 'Forex Spot', category: 'Forex', isPopular: true },
  { symbol: 'GBP', name: 'British Pound', faName: 'پوند انگلیس', coingeckoId: 'british-pound', network: 'Forex Spot', category: 'Forex', isPopular: true },
  { symbol: 'JPY', name: 'Japanese Yen', faName: 'ین ژاپن', coingeckoId: 'japanese-yen', network: 'Forex Spot', category: 'Forex', isPopular: true },
  { symbol: 'AUD', name: 'Australian Dollar', faName: 'دلار استرالیا', coingeckoId: 'australian-dollar', network: 'Forex Spot', category: 'Forex', isPopular: true },
  { symbol: 'CAD', name: 'Canadian Dollar', faName: 'دلار کانادا', coingeckoId: 'canadian-dollar', network: 'Forex Spot', category: 'Forex', isPopular: true },
  { symbol: 'CHF', name: 'Swiss Franc', faName: 'فرانک سوئیس', coingeckoId: 'swiss-franc', network: 'Forex Spot', category: 'Forex', isPopular: true },

  // Metals (Gold, Silver, Platinum, Copper)
  { symbol: 'XAU', name: 'Gold Spot', faName: 'انس طلا', coingeckoId: 'tether-gold', network: 'Precious Metals', category: 'Metals', isPopular: true },
  { symbol: 'PAXG', name: 'PAX Gold', faName: 'پکس گلد (اونس طلا)', coingeckoId: 'pax-gold', network: 'Ethereum / Gold', category: 'Metals', isPopular: true },
  { symbol: 'XAG', name: 'Silver Spot', faName: 'نقره جهانی', coingeckoId: 'silver', network: 'Precious Metals', category: 'Metals', isPopular: true },
  { symbol: 'XPT', name: 'Platinum Spot', faName: 'پلاتین', coingeckoId: 'platinum', network: 'Precious Metals', category: 'Metals', isPopular: true },
  { symbol: 'COPPER', name: 'Copper Futures', faName: 'مس جهانی', coingeckoId: 'copper', network: 'Industrial Metals', category: 'Metals', isPopular: true },

  // Energy & Oil
  { symbol: 'BRENT', name: 'Brent Crude Oil', faName: 'نفت برنت', coingeckoId: 'crude-oil', network: 'Commodities / ICE', category: 'Energy', isPopular: true },
  { symbol: 'WTI', name: 'WTI Crude Oil', faName: 'نفت وست تگزاس', coingeckoId: 'wti-crude-oil', network: 'Commodities / NYMEX', category: 'Energy', isPopular: true },
  { symbol: 'NATGAS', name: 'Natural Gas', faName: 'گاز طبیعی', coingeckoId: 'natural-gas', network: 'Commodities', category: 'Energy', isPopular: true },

  // Global Equities & Indices
  { symbol: 'NVDA', name: 'NVIDIA Corp', faName: 'سهام انویدیا', coingeckoId: 'nvidia', network: 'NASDAQ: NVDA', category: 'Stocks', isPopular: true },
  { symbol: 'AAPL', name: 'Apple Inc', faName: 'سهام اپل', coingeckoId: 'apple', network: 'NASDAQ: AAPL', category: 'Stocks', isPopular: true },
  { symbol: 'TSLA', name: 'Tesla Inc', faName: 'سهام تسلا', coingeckoId: 'tesla', network: 'NASDAQ: TSLA', category: 'Stocks', isPopular: true },
  { symbol: 'MSFT', name: 'Microsoft Corp', faName: 'سهام مایکروسافت', coingeckoId: 'microsoft', network: 'NASDAQ: MSFT', category: 'Stocks', isPopular: true },
  { symbol: 'AMZN', name: 'Amazon.com', faName: 'سهام آمازون', coingeckoId: 'amazon', network: 'NASDAQ: AMZN', category: 'Stocks', isPopular: true },
  { symbol: 'GOOGL', name: 'Alphabet Google', faName: 'سهام گوگل', coingeckoId: 'google', network: 'NASDAQ: GOOGL', category: 'Stocks', isPopular: true },
  { symbol: 'META', name: 'Meta Platforms', faName: 'سهام متا', coingeckoId: 'meta', network: 'NASDAQ: META', category: 'Stocks', isPopular: true },
  { symbol: 'MSTR', name: 'MicroStrategy (BTC)', faName: 'مایکرواستراتژی', coingeckoId: 'microstrategy', network: 'NASDAQ: MSTR', category: 'Stocks', isPopular: true },
  { symbol: 'COIN', name: 'Coinbase Global', faName: 'کوین‌بیس', coingeckoId: 'coinbase', network: 'NASDAQ: COIN', category: 'Stocks', isPopular: true },
  { symbol: 'TSM', name: 'TSMC Semiconductor', faName: 'تی‌اس‌ام‌سی', coingeckoId: 'tsmc', network: 'NYSE: TSM', category: 'Stocks', isPopular: true },
  { symbol: 'AMD', name: 'AMD Processors', faName: 'ای‌ام‌دی', coingeckoId: 'amd', network: 'NASDAQ: AMD', category: 'Stocks', isPopular: true },
  { symbol: 'AVGO', name: 'Broadcom', faName: 'برودکام', coingeckoId: 'broadcom', network: 'NASDAQ: AVGO', category: 'Stocks', isPopular: true },
  { symbol: 'ASML', name: 'ASML Lithography', faName: 'ای‌اس‌ام‌ال', coingeckoId: 'asml', network: 'NASDAQ: ASML', category: 'Stocks', isPopular: true },
  { symbol: 'ARM', name: 'Arm Holdings', faName: 'آرم هولدینگز', coingeckoId: 'arm', network: 'NASDAQ: ARM', category: 'Stocks', isPopular: true },
  { symbol: 'NFLX', name: 'Netflix', faName: 'نتفلیکس', coingeckoId: 'netflix', network: 'NASDAQ: NFLX', category: 'Stocks', isPopular: true },
  { symbol: 'HOOD', name: 'Robinhood', faName: 'رابین‌هود', coingeckoId: 'robinhood', network: 'NASDAQ: HOOD', category: 'Stocks', isPopular: true },
  { symbol: 'BRKB', name: 'Berkshire Hathaway', faName: 'برکشایر هاتاوی', coingeckoId: 'berkshire', network: 'NYSE: BRK.B', category: 'Stocks', isPopular: true },
  { symbol: 'JPM', name: 'JPMorgan Chase', faName: 'بانک جی‌پی مورگان', coingeckoId: 'jpmorgan', network: 'NYSE: JPM', category: 'Stocks', isPopular: true },
  { symbol: 'LLY', name: 'Eli Lilly', faName: 'الای لیلی', coingeckoId: 'eli-lilly', network: 'NYSE: LLY', category: 'Stocks', isPopular: true },
  { symbol: 'SPX', name: 'S&P 500 Index', faName: 'شاخص اس‌اند‌پی ۵۰۰', coingeckoId: 'sp500', network: 'US Index', category: 'Indices', isPopular: true },
  { symbol: 'NDX', name: 'NASDAQ 100', faName: 'شاخص نزدک ۱۰۰', coingeckoId: 'nasdaq', network: 'US Index', category: 'Indices', isPopular: true },
  { symbol: 'DJI', name: 'Dow Jones', faName: 'شاخص داو جونز', coingeckoId: 'dow-jones', network: 'US Index', category: 'Indices', isPopular: true },
  { symbol: 'VIX', name: 'Volatility VIX', faName: 'شاخص نوسان VIX', coingeckoId: 'cboe-volatility-index', network: 'US Index', category: 'Indices', isPopular: true },
  { symbol: 'DAX', name: 'German DAX 40', faName: 'شاخص داکس آلمان', coingeckoId: 'dax', network: 'EU Index', category: 'Indices', isPopular: true },
  { symbol: 'FTSE', name: 'UK FTSE 100', faName: 'شاخص فوتسی لندن', coingeckoId: 'ftse', network: 'UK Index', category: 'Indices', isPopular: true },
  { symbol: 'N225', name: 'Nikkei 225', faName: 'شاخص نیکی ژاپن', coingeckoId: 'nikkei', network: 'Asia Index', category: 'Indices', isPopular: true },
  { symbol: 'DXY', name: 'US Dollar Index', faName: 'شاخص دلار DXY', coingeckoId: 'dollar-index', network: 'FX Index', category: 'Indices', isPopular: true },

  // Sovereign Bonds & Treasury Yields
  { symbol: 'US10Y', name: 'US 10Y Yield', faName: 'اوراق ۱۰ ساله آمریکا', coingeckoId: 'us-10y', network: 'US Treasury', category: 'Bonds', isPopular: true },
  { symbol: 'US02Y', name: 'US 2Y Yield', faName: 'اوراق ۲ ساله آمریکا', coingeckoId: 'us-2y', network: 'US Treasury', category: 'Bonds', isPopular: true },
  { symbol: 'US30Y', name: 'US 30Y Yield', faName: 'اوراق ۳۰ ساله آمریکا', coingeckoId: 'us-30y', network: 'US Treasury', category: 'Bonds', isPopular: true },
  { symbol: 'DE10Y', name: 'German 10Y Bund', faName: 'اوراق ۱۰ ساله آلمان', coingeckoId: 'de-10y', network: 'Euro Sovereign', category: 'Bonds', isPopular: true },

  // Top Layer 1 & Major Cryptos
  { symbol: 'BTC', name: 'Bitcoin', faName: 'بیت‌کوین', coingeckoId: 'bitcoin', network: 'Bitcoin', category: 'L1', isPopular: true },
  { symbol: 'ETH', name: 'Ethereum', faName: 'اتریوم', coingeckoId: 'ethereum', network: 'Ethereum', category: 'L1', isPopular: true },
  { symbol: 'SOL', name: 'Solana', faName: 'سولانا', coingeckoId: 'solana', network: 'Solana', category: 'L1', isPopular: true },
  { symbol: 'BNB', name: 'BNB', faName: 'بایننس کوین', coingeckoId: 'binancecoin', network: 'BNB Chain', category: 'L1', isPopular: true },
  { symbol: 'XRP', name: 'Ripple', faName: 'ریپل', coingeckoId: 'ripple', network: 'XRP Ledger', category: 'L1', isPopular: true },
  { symbol: 'DOGE', name: 'Dogecoin', faName: 'دوج‌کوین', coingeckoId: 'dogecoin', network: 'Dogecoin', category: 'Meme', isPopular: true },
  { symbol: 'ADA', name: 'Cardano', faName: 'کاردانو', coingeckoId: 'cardano', network: 'Cardano', category: 'L1', isPopular: true },
  { symbol: 'AVAX', name: 'Avalanche', faName: 'آوالانچ', coingeckoId: 'avalanche-2', network: 'Avalanche', category: 'L1', isPopular: true },
  { symbol: 'SUI', name: 'Sui Network', faName: 'سویی', coingeckoId: 'sui', network: 'Sui Network', category: 'L1', isPopular: true },
  { symbol: 'TON', name: 'Toncoin', faName: 'تون کوین', coingeckoId: 'the-open-network', network: 'TON Network', category: 'L1', isPopular: true },
  { symbol: 'KAS', name: 'Kaspa', faName: 'کاسپا', coingeckoId: 'kaspa', network: 'Kaspa BlockDAG', category: 'L1', isPopular: true },
  { symbol: 'NEAR', name: 'NEAR Protocol', faName: 'نیر پروتکل', coingeckoId: 'near', network: 'NEAR', category: 'L1', isPopular: true },
  { symbol: 'DOT', name: 'Polkadot', faName: 'پولکادات', coingeckoId: 'polkadot', network: 'Polkadot', category: 'L1', isPopular: true },
  { symbol: 'TRX', name: 'TRON', faName: 'ترون', coingeckoId: 'tron', network: 'TRON', category: 'L1', isPopular: true },
  { symbol: 'LTC', name: 'Litecoin', faName: 'لایت‌کوین', coingeckoId: 'litecoin', network: 'Litecoin', category: 'L1', isPopular: true },
  { symbol: 'BCH', name: 'Bitcoin Cash', faName: 'بیت‌کوین کش', coingeckoId: 'bitcoin-cash', network: 'Bitcoin Cash', category: 'L1', isPopular: true },
  { symbol: 'APT', name: 'Aptos', faName: 'آپتوس', coingeckoId: 'aptos', network: 'Aptos', category: 'L1', isPopular: true },
  { symbol: 'SEI', name: 'Sei Network', faName: 'سی', coingeckoId: 'sei-network', network: 'Sei', category: 'L1', isPopular: true },
  { symbol: 'ATOM', name: 'Cosmos', faName: 'کازموس', coingeckoId: 'cosmos', network: 'Cosmos Hub', category: 'L1', isPopular: false },
  { symbol: 'ALGO', name: 'Algorand', faName: 'الگوراند', coingeckoId: 'algorand', network: 'Algorand', category: 'L1', isPopular: false },
  { symbol: 'XMR', name: 'Monero', faName: 'مونرو', coingeckoId: 'monero', network: 'Monero', category: 'L1', isPopular: false },
  { symbol: 'ICP', name: 'Internet Computer', faName: 'اینترنت کامپیوتر', coingeckoId: 'internet-computer', network: 'ICP', category: 'L1', isPopular: false },
  { symbol: 'HBAR', name: 'Hedera', faName: 'هدرا', coingeckoId: 'hedera-hashgraph', network: 'Hedera', category: 'L1', isPopular: false },
  { symbol: 'FTM', name: 'Sonic (Fantom)', faName: 'فانتوم', coingeckoId: 'fantom', network: 'Sonic / Fantom', category: 'L1', isPopular: false },
  
  // AI & Big Data / DePIN
  { symbol: 'TAO', name: 'Bittensor', faName: 'بیت‌تنسور', coingeckoId: 'bittensor', network: 'Bittensor Subnet', category: 'AI', isPopular: true },
  { symbol: 'RENDER', name: 'Render', faName: 'رندر', coingeckoId: 'render-token', network: 'Solana / Ethereum', category: 'AI', isPopular: true },
  { symbol: 'FET', name: 'Artificial Superintelligence', faName: 'فچ ای‌آی', coingeckoId: 'fetch-ai', network: 'Ethereum', category: 'AI', isPopular: true },
  { symbol: 'GRASS', name: 'Grass Network', faName: 'گرس', coingeckoId: 'grass', network: 'Solana (SPL)', category: 'DePIN', isPopular: true },
  { symbol: 'IO', name: 'io.net', faName: 'آی او نت', coingeckoId: 'io-net', network: 'Solana (SPL)', category: 'AI', isPopular: true },
  { symbol: 'AI16Z', name: 'ai16z', faName: 'ای‌آی ۱۶ زد', coingeckoId: 'ai16z', network: 'Solana (SPL)', category: 'AI', isPopular: true },
  { symbol: 'VIRTUAL', name: 'Virtuals Protocol', faName: 'ویرچوالز', coingeckoId: 'virtuals-protocol', network: 'Base / Ethereum', category: 'AI', isPopular: true },
  { symbol: 'WLD', name: 'Worldcoin', faName: 'ورلد کوین', coingeckoId: 'worldcoin-wld', network: 'Optimism / World Chain', category: 'AI', isPopular: false },
  { symbol: 'FIL', name: 'Filecoin', faName: 'فایل‌کوین', coingeckoId: 'filecoin', network: 'Filecoin', category: 'DePIN', isPopular: false },
  { symbol: 'GRT', name: 'The Graph', faName: 'گراف', coingeckoId: 'the-graph', network: 'Arbitrum / Ethereum', category: 'AI', isPopular: false },

  // Top Meme Coins & Viral Solana / Ethereum / TON tokens
  { symbol: 'PEPE', name: 'Pepe', faName: 'پپه', coingeckoId: 'pepe', network: 'Ethereum (ERC-20)', category: 'Meme', isPopular: true },
  { symbol: 'SHIB', name: 'Shiba Inu', faName: 'شیبا اینو', coingeckoId: 'shiba-inu', network: 'Ethereum (ERC-20)', category: 'Meme', isPopular: true },
  { symbol: 'WIF', name: 'dogwifhat', faName: 'ویف', coingeckoId: 'dogwifcoin', network: 'Solana (SPL)', category: 'Meme', isPopular: true },
  { symbol: 'BONK', name: 'Bonk', faName: 'بونک', coingeckoId: 'bonk', network: 'Solana (SPL)', category: 'Meme', isPopular: true },
  { symbol: 'FLOKI', name: 'FLOKI', faName: 'فلوکی', coingeckoId: 'floki', network: 'BNB Chain / Ethereum', category: 'Meme', isPopular: true },
  { symbol: 'PNUT', name: 'Peanut the Squirrel', faName: 'پینات', coingeckoId: 'peanut-the-squirrel', network: 'Solana (SPL)', category: 'Meme', isPopular: true },
  { symbol: 'GOAT', name: 'Goatseus Maximus', faName: 'گوت', coingeckoId: 'goatseus-maximus', network: 'Solana (SPL)', category: 'Meme', isPopular: true },
  { symbol: 'MOODENG', name: 'Moo Deng', faName: 'مودنگ', coingeckoId: 'moo-deng', network: 'Solana (SPL)', category: 'Meme', isPopular: true },
  { symbol: 'NEIRO', name: 'Neiro', faName: 'نیرو', coingeckoId: 'neiro-on-eth', network: 'Ethereum (ERC-20)', category: 'Meme', isPopular: true },
  { symbol: 'NOT', name: 'Notcoin', faName: 'نات کوین', coingeckoId: 'notcoin', network: 'TON Network', category: 'Meme', isPopular: true },
  { symbol: 'DOGS', name: 'Dogs', faName: 'داگز', coingeckoId: 'dogs-2', network: 'TON Network', category: 'Meme', isPopular: true },
  { symbol: 'BOME', name: 'BOOK OF MEME', faName: 'بوم', coingeckoId: 'book-of-meme', network: 'Solana (SPL)', category: 'Meme', isPopular: false },
  { symbol: 'MEW', name: 'cat in a dogs world', faName: 'میو', coingeckoId: 'cat-in-a-dogs-world', network: 'Solana (SPL)', category: 'Meme', isPopular: false },
  { symbol: 'FARTCOIN', name: 'Fartcoin', faName: 'فارت کوین', coingeckoId: 'fartcoin', network: 'Solana (SPL)', category: 'Meme', isPopular: false },
  { symbol: 'TRUMP', name: 'Official Trump', faName: 'ترامپ', coingeckoId: 'official-trump', network: 'Solana (SPL)', category: 'Meme', isPopular: false },

  // Layer 2 & Modular Rollups
  { symbol: 'ARB', name: 'Arbitrum', faName: 'آربیتروم', coingeckoId: 'arbitrum', network: 'Arbitrum One', category: 'L2', isPopular: true },
  { symbol: 'OP', name: 'Optimism', faName: 'اپتیمیسم', coingeckoId: 'optimism', network: 'OP Mainnet', category: 'L2', isPopular: true },
  { symbol: 'TIA', name: 'Celestia', faName: 'سلستیا', coingeckoId: 'celestia', network: 'Celestia DA', category: 'Infra', isPopular: true },
  { symbol: 'STRK', name: 'Starknet', faName: 'استارک‌نت', coingeckoId: 'starknet', network: 'Starknet', category: 'L2', isPopular: false },
  { symbol: 'BLAST', name: 'Blast', faName: 'بلاست', coingeckoId: 'blast', network: 'Blast L2', category: 'L2', isPopular: false },
  { symbol: 'ZK', name: 'ZKsync', faName: 'زد کی سینک', coingeckoId: 'zksync', network: 'ZKsync Era', category: 'L2', isPopular: false },
  { symbol: 'POL', name: 'Polygon', faName: 'پالیگان', coingeckoId: 'polygon-ecosystem-token', network: 'Polygon PoS', category: 'L2', isPopular: false },

  // DeFi Leaders & RWA
  { symbol: 'LINK', name: 'Chainlink', faName: 'چین‌لینک', coingeckoId: 'chainlink', network: 'Ethereum', category: 'Infra', isPopular: true },
  { symbol: 'AAVE', name: 'Aave', faName: 'آوه', coingeckoId: 'aave', network: 'Ethereum / Multi-chain', category: 'DeFi', isPopular: true },
  { symbol: 'UNI', name: 'Uniswap', faName: 'یونی‌سواپ', coingeckoId: 'uniswap', network: 'Ethereum / Multi-chain', category: 'DeFi', isPopular: true },
  { symbol: 'JUP', name: 'Jupiter', faName: 'ژوپیتر', coingeckoId: 'jupiter-exchange-solana', network: 'Solana (SPL)', category: 'DeFi', isPopular: true },
  { symbol: 'RAY', name: 'Raydium', faName: 'ریدیوم', coingeckoId: 'raydium', network: 'Solana (SPL)', category: 'DeFi', isPopular: true },
  { symbol: 'PENDLE', name: 'Pendle', faName: 'پندل', coingeckoId: 'pendle', network: 'Arbitrum / Ethereum', category: 'DeFi', isPopular: true },
  { symbol: 'ONDO', name: 'Ondo Finance', faName: 'اوندو', coingeckoId: 'ondo-finance', network: 'Ethereum / Solana', category: 'RWA', isPopular: true },
  { symbol: 'ENA', name: 'Ethena', faName: 'اتنا', coingeckoId: 'ethena', network: 'Ethereum', category: 'DeFi', isPopular: true },
  { symbol: 'INJ', name: 'Injective', faName: 'اینجکتیو', coingeckoId: 'injective-protocol', network: 'Injective L1', category: 'DeFi', isPopular: true },
  { symbol: 'MKR', name: 'Maker', faName: 'میکر', coingeckoId: 'maker', network: 'Ethereum', category: 'DeFi', isPopular: false },
  { symbol: 'RUNE', name: 'THORChain', faName: 'تورچین', coingeckoId: 'thorchain', network: 'THORChain', category: 'DeFi', isPopular: false },
  { symbol: 'PYTH', name: 'Pyth Network', faName: 'پایث', coingeckoId: 'pyth-network', network: 'Solana / Multi-chain', category: 'Infra', isPopular: false },
  { symbol: 'GMX', name: 'GMX', faName: 'جی ام ایکس', coingeckoId: 'gmx', network: 'Arbitrum / Avalanche', category: 'DeFi', isPopular: false },
  { symbol: 'ETHFI', name: 'ether.fi', faName: 'اترفای', coingeckoId: 'ether-fi', network: 'Ethereum', category: 'DeFi', isPopular: false },

  // Gaming & Metaverse
  { symbol: 'GALA', name: 'Gala', faName: 'گالا', coingeckoId: 'gala', network: 'GalaChain / Ethereum', category: 'Gaming', isPopular: false },
  { symbol: 'BEAM', name: 'Beam', faName: 'بیم', coingeckoId: 'beam-2', network: 'Avalanche Subnet', category: 'Gaming', isPopular: false },
  { symbol: 'SAND', name: 'The Sandbox', faName: 'سندباکس', coingeckoId: 'the-sandbox', network: 'Ethereum / Polygon', category: 'Gaming', isPopular: false },
  { symbol: 'AXS', name: 'Axie Infinity', faName: 'اکسی اینفینیتی', coingeckoId: 'axie-infinity', network: 'Ronin', category: 'Gaming', isPopular: false },
];

export const POPULAR_CRYPTO_SYMBOLS: SymbolInfo[] = POPULAR_CRYPTO_ASSETS.map((asset) => ({
  symbol: `${asset.symbol}USDT`,
  baseAsset: asset.symbol,
  quoteAsset: 'USDT',
  displayName: asset.name,
  faDisplayName: asset.faName,
  exchange: 'Binance',
  network: asset.network,
  category: asset.category,
  isPopular: asset.isPopular,
}));

/**
 * 5 Smart Alert Profiles for quick 1-click strategy creation
 */
export const ALERT_PROFILE_PRESETS: AlertProfilePreset[] = [
  {
    id: 'scalper',
    nameEn: '⚡ Scalper Pulse',
    nameFa: '⚡ اسکالپینگ سریع (۰.۷۵٪)',
    descEn: 'Instant 0.75% micro-ladder alerts in both directions. Ideal for day traders.',
    descFa: 'هشدارهای نردبانی ۰.۷۵ درصدی در هر دو جهت برای نوسان‌گیری کوتاه‌مدت.',
    icon: 'Zap',
    type: 'repeatingPercentage',
    targetValue: 0.75,
    direction: 'both',
    soundTone: 'classic',
    voiceAlert: false,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400'
  },
  {
    id: 'swing',
    nameEn: '📊 Swing Breakout',
    nameFa: '📊 سوئینگ و تغییر روند (۳.۵٪)',
    descEn: 'Trailing peak & 3.5% trend reversal alert. Captures pullbacks and breakouts.',
    descFa: 'تعقیب سقف و کف با ۳.۵٪ چرخش جهت شکار پولبک‌ها و شکست‌های مهم.',
    icon: 'TrendingUp',
    type: 'trailingPeak',
    targetValue: 3.5,
    direction: 'both',
    soundTone: 'radar',
    voiceAlert: false,
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-cyan-400'
  },
  {
    id: 'hodler',
    nameEn: '💎 Hodler Milestone',
    nameFa: '💎 تارگت هولدر بلندمدت (۱۰٪)',
    descEn: '10% major milestone alert with voice announcement for long-term investments.',
    descFa: 'هشدار نقاط عطف ۱۰ درصدی با اعلام صوتی برای اهداف سرمایه‌گذاری بلندمدت.',
    icon: 'Shield',
    type: 'repeatingPercentage',
    targetValue: 10.0,
    direction: 'upOnly',
    soundTone: 'bell',
    voiceAlert: true,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400'
  },
  {
    id: 'crash_hunter',
    nameEn: '🩸 Flash Crash Hunter',
    nameFa: '🩸 شکارچی ریزش سریع (-۵٪)',
    descEn: 'Urgent siren alarm on 5% sudden dips. Instant buy-the-dip alert.',
    descFa: 'آژیر هشدار فوری در ریزش ۵ درصدی برای خرید پله‌ای در کف‌های قیمتی.',
    icon: 'AlertTriangle',
    type: 'repeatingPercentage',
    targetValue: 5.0,
    direction: 'downOnly',
    soundTone: 'siren',
    voiceAlert: true,
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-400'
  },
  {
    id: 'volatility',
    nameEn: '🌊 Volatility Band',
    nameFa: '🌊 نوسان‌گیری رنج (۲.۰٪)',
    descEn: '2.0% bidirectional band trigger with crisp crystal bell chime.',
    descFa: 'هشدار ۲.۰ درصدی دوطرفه برای شناسایی خروج از کانال‌های رنج قیمتی.',
    icon: 'Activity',
    type: 'repeatingPercentage',
    targetValue: 2.0,
    direction: 'both',
    soundTone: 'crystal',
    voiceAlert: false,
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-400'
  }
];

/**
 * Universal English-first Search through symbols, English names, Persian names, Networks and Categories
 */
export function searchCryptoCatalog(query: string): CryptoAsset[] {
  if (!query || !query.trim()) return POPULAR_CRYPTO_ASSETS;
  const q = query.trim().toLowerCase();

  return POPULAR_CRYPTO_ASSETS.filter((asset) => {
    return (
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.faName.toLowerCase().includes(q) ||
      (asset.network && asset.network.toLowerCase().includes(q)) ||
      (asset.category && asset.category.toLowerCase().includes(q)) ||
      (asset.coingeckoId && asset.coingeckoId.toLowerCase().includes(q))
    );
  });
}

/**
 * Normalizes standard symbol (e.g. BTC/USDT or BTCUSDT) to exchange-specific representation
 */
export function formatSymbolForExchange(standardSymbol: string, exchange: ExchangeName): string {
  const clean = standardSymbol.replace(/[-_/]/g, '').toUpperCase();
  // Extract base and quote
  let base = 'BTC';
  let quote = 'USDT';

  for (const q of ['USDT', 'USDC', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'TRY', 'BRL', 'RUB', 'KRW', 'AED', 'IRR', 'TMN', 'IRT', 'BTC', 'ETH']) {
    if (clean.endsWith(q) && clean.length > q.length) {
      base = clean.slice(0, -q.length);
      quote = q;
      break;
    }
  }

  switch (exchange) {
    case 'Binance':
      return `${base.toLowerCase()}${quote.toLowerCase()}`; // "btcusdt"
    case 'Coinbase':
      return `${base}-${quote === 'USDT' ? 'USD' : quote}`; // "BTC-USD"
    case 'Kraken':
      const kBase = base === 'BTC' ? 'XBT' : base;
      return `${kBase}/${quote === 'USDT' ? 'USD' : quote}`; // "XBT/USD"
    case 'OKX':
      return `${base}-${quote}`; // "BTC-USDT"
    case 'MEXC':
      return `${base}${quote}`; // "BTCUSDT"
    case 'KuCoin':
      return `${base}-${quote}`; // "BTC-USDT"
    case 'Bybit':
      return `${base}${quote}`; // "BTCUSDT"
    case 'Bitfinex':
      return `t${base}${quote === 'USDT' ? 'UST' : quote}`; // "tBTCUSD"
    case 'Gate.io':
      return `${base}_${quote}`; // "BTC_USDT"
    case 'Bitstamp':
      return `${base.toLowerCase()}${quote.toLowerCase()}`; // "btcusd"
    case 'HTX':
      return `${base.toLowerCase()}${quote.toLowerCase()}`; // "btcusdt"
    case 'Gemini':
      return `${base.toLowerCase()}${quote.toLowerCase()}`; // "btcusd"
    case 'Bitget':
      return `${base}${quote}`; // "BTCUSDT"
    case 'Poloniex':
      return `${base}_${quote}`; // "BTC_USDT"
    case 'Tabdeal':
      return `${base}_${quote === 'TMN' || quote === 'IRR' ? 'IRT' : quote}`; // "BTC_IRT"
    case 'Nobitex':
      return `${base.toLowerCase()}-${quote === 'TMN' || quote === 'IRT' ? 'rls' : quote.toLowerCase()}`; // "btc-rls"
    case 'CoinGecko':
      return `${base}/${quote}`;
    default:
      return `${base}${quote}`;
  }
}

/**
 * Converts exchange raw symbol to standard symbol (e.g. "btcusdt" or "BTC-USDT" -> "BTCUSDT")
 */
export function parseRawSymbolToStandard(rawSymbol: string): string {
  return rawSymbol.replace(/[-_/]/g, '').toUpperCase();
}

/**
 * Formats a numeric price with the appropriate currency symbol and decimals
 */
export function formatCurrencyPrice(price: number, quoteAsset: string = 'USDT'): string {
  if (price === undefined || isNaN(price)) return '---';

  const quote = SUPPORTED_QUOTE_CURRENCIES.find(
    (q) => q.code.toUpperCase() === quoteAsset.toUpperCase()
  ) || { symbol: '$', code: quoteAsset };

  const symbol = quote.symbol;

  let formattedNum = '';
  if (price >= 10000) {
    formattedNum = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    formattedNum = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  } else if (price >= 0.0001) {
    formattedNum = price.toFixed(6);
  } else {
    formattedNum = price.toFixed(8);
  }

  // Symbol placement
  if (['$', '€', '£', '¥', 'C$', 'A$', '₹', '₺', 'R$'].includes(symbol)) {
    return `${symbol}${formattedNum}`;
  } else if (symbol === 'تومان') {
    return `${formattedNum} تومان`;
  } else if (symbol === '₿') {
    return `${formattedNum} ₿`;
  } else if (symbol === 'Ξ') {
    return `${formattedNum} Ξ`;
  } else {
    return `${formattedNum} ${symbol}`;
  }
}
