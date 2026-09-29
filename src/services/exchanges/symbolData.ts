import { SymbolInfo, ExchangeName, ExchangeMetadata } from '../../types/crypto';

export interface QuoteCurrency {
  code: string;
  name: string;
  faName: string;
  symbol: string;
  isFiat: boolean;
}

export const SUPPORTED_QUOTE_CURRENCIES: QuoteCurrency[] = [
  { code: 'USDT', name: 'Tether USD', faName: 'تتر دلار', symbol: '$', isFiat: false },
  { code: 'USD', name: 'US Dollar', faName: 'دلار آمریکا', symbol: '$', isFiat: true },
  { code: 'EUR', name: 'Euro', faName: 'یورو', symbol: '€', isFiat: true },
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
  { code: 'IRR', name: 'Iranian Toman', faName: 'تومان ایران', symbol: 'تومان', isFiat: true },
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
  isPopular?: boolean;
}

export const POPULAR_CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', faName: 'بیت‌کوین', coingeckoId: 'bitcoin', isPopular: true },
  { symbol: 'ETH', name: 'Ethereum', faName: 'اتریوم', coingeckoId: 'ethereum', isPopular: true },
  { symbol: 'SOL', name: 'Solana', faName: 'سولانا', coingeckoId: 'solana', isPopular: true },
  { symbol: 'BNB', name: 'BNB', faName: 'بایننس کوین', coingeckoId: 'binancecoin', isPopular: true },
  { symbol: 'XRP', name: 'Ripple', faName: 'ریپل', coingeckoId: 'ripple', isPopular: true },
  { symbol: 'DOGE', name: 'Dogecoin', faName: 'دوج‌کوین', coingeckoId: 'dogecoin', isPopular: true },
  { symbol: 'ADA', name: 'Cardano', faName: 'کاردانو', coingeckoId: 'cardano', isPopular: true },
  { symbol: 'AVAX', name: 'Avalanche', faName: 'آوالانچ', coingeckoId: 'avalanche-2', isPopular: true },
  { symbol: 'SUI', name: 'Sui Network', faName: 'سویی', coingeckoId: 'sui', isPopular: true },
  { symbol: 'PEPE', name: 'Pepe', faName: 'پپه', coingeckoId: 'pepe', isPopular: true },
  { symbol: 'SHIB', name: 'Shiba Inu', faName: 'شیبا اینو', coingeckoId: 'shiba-inu', isPopular: true },
  { symbol: 'TON', name: 'Toncoin', faName: 'تون کوین', coingeckoId: 'the-open-network', isPopular: true },
  { symbol: 'LINK', name: 'Chainlink', faName: 'چین‌لینک', coingeckoId: 'chainlink', isPopular: true },
  { symbol: 'NEAR', name: 'NEAR Protocol', faName: 'نیر پروتکل', coingeckoId: 'near', isPopular: true },
  { symbol: 'DOT', name: 'Polkadot', faName: 'پولکادات', coingeckoId: 'polkadot', isPopular: true },
  { symbol: 'LTC', name: 'Litecoin', faName: 'لایت‌کوین', coingeckoId: 'litecoin', isPopular: true },
  { symbol: 'BCH', name: 'Bitcoin Cash', faName: 'بیت‌کوین کش', coingeckoId: 'bitcoin-cash', isPopular: true },
  { symbol: 'TRX', name: 'TRON', faName: 'ترون', coingeckoId: 'tron', isPopular: true },
  { symbol: 'KAS', name: 'Kaspa', faName: 'کاسپا', coingeckoId: 'kaspa', isPopular: true },
  { symbol: 'TAO', name: 'Bittensor', faName: 'بیت‌تنسور', coingeckoId: 'bittensor', isPopular: true },
  { symbol: 'RENDER', name: 'Render', faName: 'رندر', coingeckoId: 'render-token', isPopular: true },
  { symbol: 'FET', name: 'Artificial Superintelligence', faName: 'فچ ای‌آی', coingeckoId: 'fetch-ai', isPopular: true },
  { symbol: 'APT', name: 'Aptos', faName: 'آپتوس', coingeckoId: 'aptos', isPopular: false },
  { symbol: 'XMR', name: 'Monero', faName: 'مونرو', coingeckoId: 'monero', isPopular: false },
  { symbol: 'XLM', name: 'Stellar', faName: 'استلار', coingeckoId: 'stellar', isPopular: false },
  { symbol: 'ALGO', name: 'Algorand', faName: 'الگوراند', coingeckoId: 'algorand', isPopular: false },
  { symbol: 'ATOM', name: 'Cosmos', faName: 'کازموس', coingeckoId: 'cosmos', isPopular: false },
  { symbol: 'UNI', name: 'Uniswap', faName: 'یونی‌سواپ', coingeckoId: 'uniswap', isPopular: false },
  { symbol: 'ICP', name: 'Internet Computer', faName: 'اینترنت کامپیوتر', coingeckoId: 'internet-computer', isPopular: false },
  { symbol: 'HBAR', name: 'Hedera', faName: 'هدرا', coingeckoId: 'hedera-hashgraph', isPopular: false },
  { symbol: 'FIL', name: 'Filecoin', faName: 'فایل‌کوین', coingeckoId: 'filecoin', isPopular: false },
  { symbol: 'ARB', name: 'Arbitrum', faName: 'آربیتروم', coingeckoId: 'arbitrum', isPopular: false },
  { symbol: 'OP', name: 'Optimism', faName: 'اپتیمیسم', coingeckoId: 'optimism', isPopular: false },
  { symbol: 'TIA', name: 'Celestia', faName: 'سلستیا', coingeckoId: 'celestia', isPopular: false },
  { symbol: 'INJ', name: 'Injective', faName: 'اینجکتیو', coingeckoId: 'injective-protocol', isPopular: false },
  { symbol: 'AAVE', name: 'Aave', faName: 'آوه', coingeckoId: 'aave', isPopular: false },
  { symbol: 'MKR', name: 'Maker', faName: 'میکر', coingeckoId: 'maker', isPopular: false },
  { symbol: 'GRT', name: 'The Graph', faName: 'گراف', coingeckoId: 'the-graph', isPopular: false },
  { symbol: 'RUNE', name: 'THORChain', faName: 'تورچین', coingeckoId: 'thorchain', isPopular: false },
  { symbol: 'SEI', name: 'Sei', faName: 'سی', coingeckoId: 'sei-network', isPopular: false },
  { symbol: 'FLOKI', name: 'FLOKI', faName: 'فلوکی', coingeckoId: 'floki', isPopular: false },
  { symbol: 'BONK', name: 'Bonk', faName: 'بونک', coingeckoId: 'bonk', isPopular: false },
  { symbol: 'WIF', name: 'dogwifhat', faName: 'ویف', coingeckoId: 'dogwifcoin', isPopular: false },
  { symbol: 'PENDLE', name: 'Pendle', faName: 'پندل', coingeckoId: 'pendle', isPopular: false },
  { symbol: 'JUP', name: 'Jupiter', faName: 'ژوپیتر', coingeckoId: 'jupiter-exchange-solana', isPopular: false },
  { symbol: 'PYTH', name: 'Pyth Network', faName: 'پایث', coingeckoId: 'pyth-network', isPopular: false },
  { symbol: 'ONDO', name: 'Ondo', faName: 'اوندو', coingeckoId: 'ondo-finance', isPopular: false },
  { symbol: 'NOT', name: 'Notcoin', faName: 'نات کوین', coingeckoId: 'notcoin', isPopular: false },
  { symbol: 'DOGS', name: 'Dogs', faName: 'داگز', coingeckoId: 'dogs-2', isPopular: false },
  { symbol: 'NEIRO', name: 'Neiro', faName: 'نیرو', coingeckoId: 'neiro-on-eth', isPopular: false },
];

export const POPULAR_CRYPTO_SYMBOLS: SymbolInfo[] = POPULAR_CRYPTO_ASSETS.map((asset) => ({
  symbol: `${asset.symbol}USDT`,
  baseAsset: asset.symbol,
  quoteAsset: 'USDT',
  displayName: asset.name,
  faDisplayName: asset.faName,
  exchange: 'Binance',
  isPopular: asset.isPopular,
}));

/**
 * Normalizes standard symbol (e.g. BTC/USDT or BTCUSDT) to exchange-specific representation
 */
export function formatSymbolForExchange(standardSymbol: string, exchange: ExchangeName): string {
  const clean = standardSymbol.replace(/[-_/]/g, '').toUpperCase();
  // Extract base and quote
  let base = 'BTC';
  let quote = 'USDT';

  for (const q of ['USDT', 'USDC', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'TRY', 'BRL', 'RUB', 'KRW', 'AED', 'IRR', 'BTC', 'ETH']) {
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
