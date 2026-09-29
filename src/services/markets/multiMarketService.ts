export type MarketType = 'crypto' | 'forex' | 'metals' | 'energy' | 'stocks' | 'indices' | 'bonds';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  faName: string;
  market: MarketType;
  quote: string; // 'USD', 'EUR', 'TMN', '%', etc.
  unit?: string; // 'oz', 'barrel', 'share', 'pip', '%', 'pts', 'گرم', 'سکه'
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketStatus: 'open' | 'closed' | 'pre-market';
  tomanPrice?: number;
  categoryName: string;
  faCategoryName: string;
  description?: string;
}

export interface MarketCategoryConfig {
  id: MarketType;
  name: string;
  faName: string;
  iconName: string;
  badgeColor: string;
  activeCount: number;
  tradingHoursFa: string;
}

export const MARKET_CATEGORIES: MarketCategoryConfig[] = [
  {
    id: 'crypto',
    name: 'Crypto',
    faName: 'رمزارزها',
    iconName: 'Coins',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    activeCount: 150,
    tradingHoursFa: '۲۴ ساعته / ۷ روز هفته',
  },
  {
    id: 'forex',
    name: 'Forex Currencies',
    faName: 'بازار فارکس',
    iconName: 'ArrowLeftRight',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    activeCount: 12,
    tradingHoursFa: 'دوشنبه تا جمعه (۲۴ ساعته)',
  },
  {
    id: 'metals',
    name: 'Precious Metals',
    faName: 'طلا و فلزات',
    iconName: 'Flame',
    badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    activeCount: 8,
    tradingHoursFa: 'بازار جهانی + بازار طلا ایران',
  },
  {
    id: 'energy',
    name: 'Energy & Commodities',
    faName: 'انرژی و نفت',
    iconName: 'Zap',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    activeCount: 6,
    tradingHoursFa: 'دوشنبه تا جمعه (ساعات بورس کالای شیکاگو)',
  },
  {
    id: 'stocks',
    name: 'Global Equities',
    faName: 'سهام جهانی',
    iconName: 'TrendingUp',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    activeCount: 30,
    tradingHoursFa: 'روزهای کاری بورس نیویورک (NYSE/NASDAQ)',
  },
  {
    id: 'indices',
    name: 'World Indices',
    faName: 'شاخص‌های کلیدی',
    iconName: 'BarChart3',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    activeCount: 14,
    tradingHoursFa: 'ساعات فعال بازارهای جهانی',
  },
  {
    id: 'bonds',
    name: 'Bonds & Yields',
    faName: 'اوراق قرضه و خزانه‌داری',
    iconName: 'Landmark',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    activeCount: 7,
    tradingHoursFa: 'ساعات بازار بین‌بانکی و اوراق دولتی',
  },
];

// Baseline Initial Feed for non-crypto markets
export const INITIAL_NON_CRYPTO_ASSETS: MarketAsset[] = [
  // 1. Metals (Gold, Silver, Platinum, Copper + Toman Gold)
  {
    id: 'XAU_USD',
    symbol: 'XAU/USD',
    name: 'Gold Spot (T. Ounce)',
    faName: 'انس طلای جهانی',
    market: 'metals',
    quote: 'USD',
    unit: 'oz',
    price: 2684.50,
    change24h: 0.82,
    high24h: 2692.10,
    low24h: 2665.40,
    marketStatus: 'open',
    categoryName: 'Precious Metal',
    faCategoryName: 'فلزات گرانبها',
    description: 'اونس تروی طلای جهانی بر پایه دلار آمریکا'
  },
  {
    id: 'GOLD_18K_IR',
    symbol: 'GOLD/18K',
    name: 'Iran Gold 18K (Gram)',
    faName: 'طلای ۱۸ عیار (هر گرم)',
    market: 'metals',
    quote: 'TMN',
    unit: 'گرم',
    price: 4520000,
    change24h: 1.15,
    high24h: 4560000,
    low24h: 4480000,
    marketStatus: 'open',
    categoryName: 'Iran Gold Market',
    faCategoryName: 'بازار طلای ایران',
    description: 'قیمت هر گرم طلای ۱۸ عیار به تومان'
  },
  {
    id: 'SEKE_EMAMI_IR',
    symbol: 'COIN/EMAMI',
    name: 'Emami Full Gold Coin',
    faName: 'سکه تمام طرح جدید (امامی)',
    market: 'metals',
    quote: 'TMN',
    unit: 'سکه',
    price: 53600000,
    change24h: 1.40,
    high24h: 54100000,
    low24h: 52900000,
    marketStatus: 'open',
    categoryName: 'Iran Coin Market',
    faCategoryName: 'بازار سکه ایران',
    description: 'قیمت سکه تمام بهار آزادی طرح جدید به تومان'
  },
  {
    id: 'XAG_USD',
    symbol: 'XAG/USD',
    name: 'Silver Spot (T. Ounce)',
    faName: 'نقره جهانی',
    market: 'metals',
    quote: 'USD',
    unit: 'oz',
    price: 31.85,
    change24h: -0.45,
    high24h: 32.20,
    low24h: 31.50,
    marketStatus: 'open',
    categoryName: 'Precious Metal',
    faCategoryName: 'فلزات گرانبها',
    description: 'اونس جهانی نقره بر پایه دلار'
  },
  {
    id: 'XPT_USD',
    symbol: 'XPT/USD',
    name: 'Platinum Spot',
    faName: 'پلاتین جهانی',
    market: 'metals',
    quote: 'USD',
    unit: 'oz',
    price: 994.20,
    change24h: 0.35,
    high24h: 1005.00,
    low24h: 987.50,
    marketStatus: 'open',
    categoryName: 'Precious Metal',
    faCategoryName: 'فلزات گرانبها'
  },
  {
    id: 'HG_USD',
    symbol: 'COPPER/USD',
    name: 'High Grade Copper',
    faName: 'مس جهانی',
    market: 'metals',
    quote: 'USD',
    unit: 'lb',
    price: 4.42,
    change24h: 1.05,
    high24h: 4.48,
    low24h: 4.36,
    marketStatus: 'open',
    categoryName: 'Industrial Metal',
    faCategoryName: 'فلزات صنعتی'
  },

  // 2. Forex Currencies
  {
    id: 'EUR_USD',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    faName: 'یورو به دلار آمریکا',
    market: 'forex',
    quote: 'USD',
    unit: 'pip',
    price: 1.0845,
    change24h: 0.18,
    high24h: 1.0875,
    low24h: 1.0815,
    marketStatus: 'open',
    categoryName: 'Major Forex',
    faCategoryName: 'جفت‌ارزهای اصلی',
    description: 'حجم‌بالاترین جفت‌ارز جهان'
  },
  {
    id: 'GBP_USD',
    symbol: 'GBP/USD',
    name: 'British Pound / USD',
    faName: 'پوند انگلیس به دلار',
    market: 'forex',
    quote: 'USD',
    unit: 'pip',
    price: 1.3025,
    change24h: -0.12,
    high24h: 1.3060,
    low24h: 1.2985,
    marketStatus: 'open',
    categoryName: 'Major Forex',
    faCategoryName: 'جفت‌ارزهای اصلی'
  },
  {
    id: 'USD_JPY',
    symbol: 'USD/JPY',
    name: 'USD / Japanese Yen',
    faName: 'دلار آمریکا به ین ژاپن',
    market: 'forex',
    quote: 'JPY',
    unit: 'pip',
    price: 152.40,
    change24h: 0.42,
    high24h: 153.10,
    low24h: 151.80,
    marketStatus: 'open',
    categoryName: 'Major Forex',
    faCategoryName: 'جفت‌ارزهای اصلی'
  },
  {
    id: 'AUD_USD',
    symbol: 'AUD/USD',
    name: 'Australian Dollar / USD',
    faName: 'دلار استرالیا به دلار',
    market: 'forex',
    quote: 'USD',
    unit: 'pip',
    price: 0.6580,
    change24h: -0.25,
    high24h: 0.6620,
    low24h: 0.6550,
    marketStatus: 'open',
    categoryName: 'Commodity Currency',
    faCategoryName: 'ارزهای کالایی'
  },
  {
    id: 'USD_CAD',
    symbol: 'USD/CAD',
    name: 'USD / Canadian Dollar',
    faName: 'دلار آمریکا به دلار کانادا',
    market: 'forex',
    quote: 'CAD',
    unit: 'pip',
    price: 1.3890,
    change24h: 0.15,
    high24h: 1.3920,
    low24h: 1.3850,
    marketStatus: 'open',
    categoryName: 'Major Forex',
    faCategoryName: 'جفت‌ارزهای اصلی'
  },
  {
    id: 'USD_CHF',
    symbol: 'USD/CHF',
    name: 'USD / Swiss Franc',
    faName: 'دلار به فرانک سوئیس',
    market: 'forex',
    quote: 'CHF',
    unit: 'pip',
    price: 0.8665,
    change24h: 0.05,
    high24h: 0.8690,
    low24h: 0.8635,
    marketStatus: 'open',
    categoryName: 'Safe Haven',
    faCategoryName: 'ارز امن'
  },
  {
    id: 'USD_AED',
    symbol: 'USD/AED',
    name: 'USD / UAE Dirham',
    faName: 'درهم امارات (نرخ رسمی)',
    market: 'forex',
    quote: 'AED',
    price: 3.6725,
    change24h: 0.00,
    high24h: 3.6730,
    low24h: 3.6720,
    marketStatus: 'open',
    categoryName: 'Middle East',
    faCategoryName: 'خاورمیانه'
  },
  {
    id: 'USD_TRY',
    symbol: 'USD/TRY',
    name: 'USD / Turkish Lira',
    faName: 'دلار به لیر ترکیه',
    market: 'forex',
    quote: 'TRY',
    price: 34.35,
    change24h: 0.28,
    high24h: 34.45,
    low24h: 34.15,
    marketStatus: 'open',
    categoryName: 'Emerging Market',
    faCategoryName: 'بازار نوظهور'
  },

  // 3. Energy & Commodities
  {
    id: 'BRENT_OIL',
    symbol: 'BRENT/USD',
    name: 'Brent Crude Oil',
    faName: 'نفت خام برنت دریای شمال',
    market: 'energy',
    quote: 'USD',
    unit: 'barrel',
    price: 74.80,
    change24h: 1.65,
    high24h: 75.90,
    low24h: 73.20,
    marketStatus: 'open',
    categoryName: 'Crude Oil',
    faCategoryName: 'نفت خام',
    description: 'شاخص مرجع قیمت‌گذاری نفت جهانی'
  },
  {
    id: 'WTI_OIL',
    symbol: 'WTI/USD',
    name: 'WTI Crude Oil',
    faName: 'نفت خام وست تگزاس (WTI)',
    market: 'energy',
    quote: 'USD',
    unit: 'barrel',
    price: 70.95,
    change24h: 1.78,
    high24h: 71.80,
    low24h: 69.40,
    marketStatus: 'open',
    categoryName: 'Crude Oil',
    faCategoryName: 'نفت خام'
  },
  {
    id: 'NATGAS_USD',
    symbol: 'NATGAS/USD',
    name: 'Henry Hub Natural Gas',
    faName: 'گاز طبیعی (هنری هاب)',
    market: 'energy',
    quote: 'USD',
    unit: 'mmBtu',
    price: 2.84,
    change24h: -2.10,
    high24h: 2.95,
    low24h: 2.78,
    marketStatus: 'open',
    categoryName: 'Gas',
    faCategoryName: 'گاز طبیعی'
  },
  {
    id: 'GASOLINE_USD',
    symbol: 'GASOLINE/USD',
    name: 'RBOB Gasoline',
    faName: 'بنزین آر‌بی‌او‌بی جهانی',
    market: 'energy',
    quote: 'USD',
    unit: 'gallon',
    price: 2.08,
    change24h: 0.95,
    high24h: 2.12,
    low24h: 2.04,
    marketStatus: 'open',
    categoryName: 'Refined Products',
    faCategoryName: 'فرآورده نفتی'
  },
  {
    id: 'HEATOIL_USD',
    symbol: 'HEATOIL/USD',
    name: 'Heating Oil Futures',
    faName: 'نفت کوره / گازوئیل',
    market: 'energy',
    quote: 'USD',
    unit: 'gallon',
    price: 2.25,
    change24h: 1.10,
    high24h: 2.29,
    low24h: 2.21,
    marketStatus: 'open',
    categoryName: 'Refined Products',
    faCategoryName: 'فرآورده نفتی'
  },

  // 4. Global Stocks
  {
    id: 'STOCK_NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    faName: 'سهام انویدیا (NVIDIA)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 141.54,
    change24h: 3.25,
    high24h: 143.80,
    low24h: 138.20,
    marketStatus: 'open',
    categoryName: 'AI & Semiconductors',
    faCategoryName: 'هوش مصنوعی و تراشه‌سازی',
    description: 'رهبر بلامنازع پردازشگرهای گرافیکی هوش مصنوعی و مراکز داده'
  },
  {
    id: 'STOCK_AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    faName: 'سهام شرکت اپل (Apple)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 232.10,
    change24h: 0.45,
    high24h: 233.90,
    low24h: 230.50,
    marketStatus: 'open',
    categoryName: 'Consumer Tech',
    faCategoryName: 'فناوری مصرفی و آیفون'
  },
  {
    id: 'STOCK_TSLA',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    faName: 'سهام تسلا (Tesla)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 260.48,
    change24h: 4.85,
    high24h: 265.00,
    low24h: 248.60,
    marketStatus: 'open',
    categoryName: 'EV & Autonomous AI',
    faCategoryName: 'خودرو برقی و رباتیک'
  },
  {
    id: 'STOCK_MSFT',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    faName: 'سهام مایکروسافت (Microsoft)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 428.15,
    change24h: 1.12,
    high24h: 431.50,
    low24h: 424.80,
    marketStatus: 'open',
    categoryName: 'Cloud & Enterprise AI',
    faCategoryName: 'رایانش ابری و هوش مصنوعی'
  },
  {
    id: 'STOCK_AMZN',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    faName: 'سهام آمازون (Amazon)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 188.40,
    change24h: 1.35,
    high24h: 190.20,
    low24h: 185.90,
    marketStatus: 'open',
    categoryName: 'E-Commerce & AWS Cloud',
    faCategoryName: 'تجارت الکترونیک و کلود'
  },
  {
    id: 'STOCK_GOOGL',
    symbol: 'GOOGL',
    name: 'Alphabet Inc. (Google)',
    faName: 'سهام گوگل / الفابت',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 169.25,
    change24h: 0.90,
    high24h: 171.00,
    low24h: 167.50,
    marketStatus: 'open',
    categoryName: 'Search & Gemini AI',
    faCategoryName: 'موتور جستجو و هوش مصنوعی'
  },
  {
    id: 'STOCK_META',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    faName: 'سهام متا (فیسبوک و اینستاگرام)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 582.30,
    change24h: 2.15,
    high24h: 588.00,
    low24h: 574.50,
    marketStatus: 'open',
    categoryName: 'Social Networks & Llama AI',
    faCategoryName: 'شبکه اجتماعی و هوش مصنوعی'
  },
  {
    id: 'STOCK_MSTR',
    symbol: 'MSTR',
    name: 'MicroStrategy Inc.',
    faName: 'سهام مایکرواستراتژی (بیت‌کوین ترژری)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 255.80,
    change24h: 6.40,
    high24h: 262.50,
    low24h: 242.00,
    marketStatus: 'open',
    categoryName: 'Bitcoin Proxy',
    faCategoryName: 'پراکسی خزانه بیت‌کوین',
    description: 'بزرگترین دارنده سازمانی بیت‌کوین در جهان'
  },
  {
    id: 'STOCK_COIN',
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    faName: 'سهام کوین‌بیس (صرافی رمزارز)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 215.30,
    change24h: 3.80,
    high24h: 220.00,
    low24h: 209.50,
    marketStatus: 'open',
    categoryName: 'Crypto Exchange',
    faCategoryName: 'صرافی و فین‌تک رمزارز'
  },
  {
    id: 'STOCK_TSM',
    symbol: 'TSM',
    name: 'Taiwan Semiconductor (TSMC)',
    faName: 'سهام تی‌اس‌ام‌سی (بزرگترین تراشه‌ساز)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 195.40,
    change24h: 2.30,
    high24h: 198.20,
    low24h: 192.10,
    marketStatus: 'open',
    categoryName: 'Semiconductors Foundry',
    faCategoryName: 'غول تولید نیمه‌هادی جهان'
  },
  {
    id: 'STOCK_AMD',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    faName: 'سهام شرکت ای‌ام‌دی (AMD)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 156.70,
    change24h: 1.85,
    high24h: 159.40,
    low24h: 154.00,
    marketStatus: 'open',
    categoryName: 'AI & Processors',
    faCategoryName: 'پردازنده‌های هوش مصنوعی و سرور'
  },
  {
    id: 'STOCK_AVGO',
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    faName: 'سهام برودکام (تراشه‌های ارتباطی)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 178.60,
    change24h: 1.45,
    high24h: 181.00,
    low24h: 175.20,
    marketStatus: 'open',
    categoryName: 'Networking Chips & AI',
    faCategoryName: 'تراشه‌های شبکه و ارتباطی'
  },
  {
    id: 'STOCK_ASML',
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    faName: 'سهام ای‌اس‌ام‌ال (تجهیزات لیتوگرافی EUV)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 724.50,
    change24h: -0.65,
    high24h: 735.00,
    low24h: 718.00,
    marketStatus: 'open',
    categoryName: 'Lithography Equipment',
    faCategoryName: 'تجهیزات فوق‌پیشرفته لیتوگرافی'
  },
  {
    id: 'STOCK_ARM',
    symbol: 'ARM',
    name: 'Arm Holdings plc',
    faName: 'سهام آرم هولدینگز (معماری پردازنده‌ها)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 148.90,
    change24h: 2.70,
    high24h: 152.00,
    low24h: 144.50,
    marketStatus: 'open',
    categoryName: 'CPU Architecture',
    faCategoryName: 'معماری پردازنده‌های موبایل و سرور'
  },
  {
    id: 'STOCK_QCOM',
    symbol: 'QCOM',
    name: 'Qualcomm Incorporated',
    faName: 'سهام کوالکام (اسنپ‌دراگون)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 172.30,
    change24h: 0.95,
    high24h: 174.50,
    low24h: 170.10,
    marketStatus: 'open',
    categoryName: 'Mobile & 5G Chips',
    faCategoryName: 'تراشه‌های موبایل و 5G'
  },
  {
    id: 'STOCK_INTC',
    symbol: 'INTC',
    name: 'Intel Corporation',
    faName: 'سهام اینتل (Intel)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 22.85,
    change24h: 1.10,
    high24h: 23.30,
    low24h: 22.40,
    marketStatus: 'open',
    categoryName: 'Semiconductors',
    faCategoryName: 'تراشه‌سازی و پردازنده'
  },
  {
    id: 'STOCK_NFLX',
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    faName: 'سهام نتفلیکس (استریم فیلم)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 755.20,
    change24h: 1.60,
    high24h: 762.00,
    low24h: 748.00,
    marketStatus: 'open',
    categoryName: 'Streaming & Media',
    faCategoryName: 'رسانه و استریم آنلاین'
  },
  {
    id: 'STOCK_ADBE',
    symbol: 'ADBE',
    name: 'Adobe Inc.',
    faName: 'سهام ادوبی (فتوشاپ و ابزارهای خلاقیت)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 498.40,
    change24h: 0.75,
    high24h: 504.00,
    low24h: 494.00,
    marketStatus: 'open',
    categoryName: 'Creative Software & AI',
    faCategoryName: 'نرم‌افزارهای گرافیکی و تولید محتوا'
  },
  {
    id: 'STOCK_ORCL',
    symbol: 'ORCL',
    name: 'Oracle Corporation',
    faName: 'سهام اوراکل (دیتابیس و کلود)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 176.90,
    change24h: 2.10,
    high24h: 179.50,
    low24h: 174.00,
    marketStatus: 'open',
    categoryName: 'Cloud Infrastructure',
    faCategoryName: 'زیرساخت ابری و پایگاه‌داده'
  },
  {
    id: 'STOCK_HOOD',
    symbol: 'HOOD',
    name: 'Robinhood Markets, Inc.',
    faName: 'سهام رابین‌هود (کارگزاری آنلاین)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 27.40,
    change24h: 4.20,
    high24h: 28.50,
    low24h: 26.10,
    marketStatus: 'open',
    categoryName: 'Fintech Brokerage',
    faCategoryName: 'کارگزاری آنلاین و فین‌تک'
  },
  {
    id: 'STOCK_BRKB',
    symbol: 'BRK.B',
    name: 'Berkshire Hathaway (Warren Buffett)',
    faName: 'سهام برکشایر هاتاوی (وارن بافت)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 452.30,
    change24h: 0.30,
    high24h: 455.00,
    low24h: 450.00,
    marketStatus: 'open',
    categoryName: 'Conglomerate & Value Investing',
    faCategoryName: 'سرمایه‌گذاری ارزشی هولدینگ بافت'
  },
  {
    id: 'STOCK_JPM',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    faName: 'سهام جی‌پی مورگان (بزرگترین بانک آمریکا)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 222.80,
    change24h: 0.85,
    high24h: 224.50,
    low24h: 220.50,
    marketStatus: 'open',
    categoryName: 'Banking & Financial',
    faCategoryName: 'خدمات بانکی و مالی بین‌المللی'
  },
  {
    id: 'STOCK_V',
    symbol: 'V',
    name: 'Visa Inc.',
    faName: 'سهام ویزا کارت (پرداخت جهانی)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 282.10,
    change24h: 0.40,
    high24h: 284.00,
    low24h: 280.50,
    marketStatus: 'open',
    categoryName: 'Payment Networks',
    faCategoryName: 'شبکه پرداخت‌های جهانی'
  },
  {
    id: 'STOCK_LLY',
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    faName: 'سهام الای لیلی (داروسازی و بیوتک)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 895.40,
    change24h: 1.95,
    high24h: 905.00,
    low24h: 884.00,
    marketStatus: 'open',
    categoryName: 'Healthcare & Pharma',
    faCategoryName: 'داروسازی و سلامت'
  },
  {
    id: 'STOCK_NVO',
    symbol: 'NVO',
    name: 'Novo Nordisk A/S',
    faName: 'سهام نوو نوردیسک (غول داروسازی اروپا)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 114.60,
    change24h: 0.80,
    high24h: 116.20,
    low24h: 113.50,
    marketStatus: 'open',
    categoryName: 'Healthcare & Pharma',
    faCategoryName: 'داروسازی و سلامت'
  },
  {
    id: 'STOCK_XOM',
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    faName: 'سهام اکسان موبیل (غول نفت و گاز)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 119.30,
    change24h: 1.15,
    high24h: 120.80,
    low24h: 118.00,
    marketStatus: 'open',
    categoryName: 'Energy & Oil',
    faCategoryName: 'نفت، گاز و پتروشیمی'
  },
  {
    id: 'STOCK_LMT',
    symbol: 'LMT',
    name: 'Lockheed Martin Corp.',
    faName: 'سهام لاکهید مارتین (صنایع دفاعی و هوافضا)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 574.80,
    change24h: 0.60,
    high24h: 580.00,
    low24h: 570.00,
    marketStatus: 'open',
    categoryName: 'Aerospace & Defense',
    faCategoryName: 'صنایع هوافضا و دفاعی'
  },
  {
    id: 'STOCK_BA',
    symbol: 'BA',
    name: 'The Boeing Company',
    faName: 'سهام شرکت بوئینگ (هواپیماسازی)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 154.20,
    change24h: -1.30,
    high24h: 158.00,
    low24h: 152.50,
    marketStatus: 'open',
    categoryName: 'Aviation & Aerospace',
    faCategoryName: 'هواپیماسازی و هوانوردی'
  },
  {
    id: 'STOCK_WMT',
    symbol: 'WMT',
    name: 'Walmart Inc.',
    faName: 'سهام والمارت (بزرگترین خرده‌فروشی جهان)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 82.15,
    change24h: 0.50,
    high24h: 83.00,
    low24h: 81.50,
    marketStatus: 'open',
    categoryName: 'Retail & Consumer Staples',
    faCategoryName: 'فروشگاه‌های زنجیره‌ای و توزیع'
  },
  {
    id: 'STOCK_COST',
    symbol: 'COST',
    name: 'Costco Wholesale Corp.',
    faName: 'سهام کاستکو (فروشگاه‌های زنجیره‌ای)',
    market: 'stocks',
    quote: 'USD',
    unit: 'share',
    price: 908.40,
    change24h: 1.05,
    high24h: 915.00,
    low24h: 900.00,
    marketStatus: 'open',
    categoryName: 'Retail & Wholesale',
    faCategoryName: 'عمده‌فروشی و توزیع کالا'
  },

  // 5. World Indices
  {
    id: 'INDEX_SPX',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    faName: 'شاخص ۵۰۰ شرکت برتر آمریکا (S&P 500)',
    market: 'indices',
    quote: 'USD',
    price: 5832.90,
    change24h: 0.65,
    high24h: 5850.20,
    low24h: 5805.10,
    marketStatus: 'open',
    categoryName: 'Major US Index',
    faCategoryName: 'شاخص اصلی آمریکا',
    description: 'شاخص استاندارد بازار سهام آمریکا'
  },
  {
    id: 'INDEX_NDX',
    symbol: 'NASDAQ 100',
    name: 'Nasdaq 100 Index',
    faName: 'شاخص ۱۰۰ شرکت فناوری نزدک',
    market: 'indices',
    quote: 'USD',
    price: 20420.50,
    change24h: 1.25,
    high24h: 20510.00,
    low24h: 20280.00,
    marketStatus: 'open',
    categoryName: 'Tech Index',
    faCategoryName: 'شاخص فناوری و رشد'
  },
  {
    id: 'INDEX_DJI',
    symbol: 'DOW JONES',
    name: 'Dow Jones Industrial Avg',
    faName: 'شاخص صنعتی داو جونز',
    market: 'indices',
    quote: 'USD',
    price: 42380.00,
    change24h: 0.35,
    high24h: 42520.00,
    low24h: 42190.00,
    marketStatus: 'open',
    categoryName: 'Industrial Index',
    faCategoryName: 'شاخص صنعتی و تجاری آمریکا'
  },
  {
    id: 'INDEX_RUT',
    symbol: 'RUSSELL 2000',
    name: 'Russell 2000 Index',
    faName: 'شاخص راسل ۲۰۰۰ (شرکت‌های کوچک)',
    market: 'indices',
    quote: 'USD',
    price: 2245.80,
    change24h: 1.40,
    high24h: 2260.00,
    low24h: 2228.00,
    marketStatus: 'open',
    categoryName: 'Small-Cap Index',
    faCategoryName: 'شاخص شرکت‌های کوچک آمریکا'
  },
  {
    id: 'INDEX_VIX',
    symbol: 'VIX',
    name: 'CBOE Volatility Index',
    faName: 'شاخص ترس و نوسان (VIX)',
    market: 'indices',
    quote: 'pts',
    price: 19.45,
    change24h: -3.20,
    high24h: 20.80,
    low24h: 18.90,
    marketStatus: 'open',
    categoryName: 'Volatility / Fear Index',
    faCategoryName: 'شاخص هیجان و ریسک بازار'
  },
  {
    id: 'INDEX_DXY',
    symbol: 'DXY',
    name: 'US Dollar Index',
    faName: 'شاخص قدرت دلار آمریکا (DXY)',
    market: 'indices',
    quote: 'USD',
    price: 104.25,
    change24h: 0.22,
    high24h: 104.50,
    low24h: 103.90,
    marketStatus: 'open',
    categoryName: 'Currency Index',
    faCategoryName: 'شاخص ارزش برابری دلار'
  },
  {
    id: 'INDEX_DAX',
    symbol: 'DAX 40',
    name: 'German DAX Index',
    faName: 'شاخص داکس آلمان (DAX)',
    market: 'indices',
    quote: 'EUR',
    price: 19480.00,
    change24h: 0.45,
    high24h: 19550.00,
    low24h: 19380.00,
    marketStatus: 'open',
    categoryName: 'European Major',
    faCategoryName: 'بورس فرانکفورت آلمان'
  },
  {
    id: 'INDEX_FTSE',
    symbol: 'FTSE 100',
    name: 'UK FTSE 100 Index',
    faName: 'شاخص فوتسی ۱۰۰ بریتانیا',
    market: 'indices',
    quote: 'GBP',
    price: 8245.50,
    change24h: -0.15,
    high24h: 8280.00,
    low24h: 8210.00,
    marketStatus: 'open',
    categoryName: 'European Major',
    faCategoryName: 'بورس لندن انگلستان'
  },
  {
    id: 'INDEX_CAC',
    symbol: 'CAC 40',
    name: 'French CAC 40 Index',
    faName: 'شاخص بورس پاریس (CAC 40)',
    market: 'indices',
    quote: 'EUR',
    price: 7520.40,
    change24h: 0.30,
    high24h: 7560.00,
    low24h: 7480.00,
    marketStatus: 'open',
    categoryName: 'European Major',
    faCategoryName: 'بورس پاریس فرانسه'
  },
  {
    id: 'INDEX_STOXX50',
    symbol: 'EURO STOXX 50',
    name: 'Euro Stoxx 50 Index',
    faName: 'شاخص ۵۰ شرکت برتر منطقه یورو',
    market: 'indices',
    quote: 'EUR',
    price: 4965.20,
    change24h: 0.50,
    high24h: 4985.00,
    low24h: 4940.00,
    marketStatus: 'open',
    categoryName: 'Pan-European',
    faCategoryName: 'شاخص شرکت‌های برتر اروپا'
  },
  {
    id: 'INDEX_N225',
    symbol: 'NIKKEI 225',
    name: 'Nikkei 225 Index (Japan)',
    faName: 'شاخص نیکی ۲۲۵ ژاپن',
    market: 'indices',
    quote: 'JPY',
    price: 38920.00,
    change24h: 1.80,
    high24h: 39150.00,
    low24h: 38600.00,
    marketStatus: 'open',
    categoryName: 'Asian Major',
    faCategoryName: 'بورس توکیو ژاپن'
  },
  {
    id: 'INDEX_HSI',
    symbol: 'HANG SENG',
    name: 'Hang Seng Index (Hong Kong)',
    faName: 'شاخص هنگ سنگ هنگ کنگ',
    market: 'indices',
    quote: 'HKD',
    price: 20680.00,
    change24h: 0.70,
    high24h: 20850.00,
    low24h: 20450.00,
    marketStatus: 'open',
    categoryName: 'Asian Major',
    faCategoryName: 'بورس هنگ کنگ'
  },
  {
    id: 'INDEX_SSEC',
    symbol: 'SHANGHAI COMP',
    name: 'Shanghai Composite Index',
    faName: 'شاخص شانگهای چین',
    market: 'indices',
    quote: 'CNY',
    price: 3310.20,
    change24h: 1.10,
    high24h: 3340.00,
    low24h: 3280.00,
    marketStatus: 'open',
    categoryName: 'Asian Major',
    faCategoryName: 'بورس شانگهای چین'
  },
  {
    id: 'INDEX_NIFTY',
    symbol: 'NIFTY 50',
    name: 'Nifty 50 Index (India)',
    faName: 'شاخص نیفتی ۵۰ بورس هند',
    market: 'indices',
    quote: 'INR',
    price: 24390.00,
    change24h: 0.40,
    high24h: 24480.00,
    low24h: 24260.00,
    marketStatus: 'open',
    categoryName: 'Emerging Markets',
    faCategoryName: 'بورس بمبئی هند'
  },

  // 6. Sovereign Bonds & Treasury Yields
  {
    id: 'BOND_US10Y',
    symbol: 'US 10Y YIELD',
    name: 'US 10-Year Treasury Yield',
    faName: 'بازده اوراق قرضه ۱۰ ساله آمریکا',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 4.28,
    change24h: 0.65,
    high24h: 4.31,
    low24h: 4.24,
    marketStatus: 'open',
    categoryName: 'US Sovereign Bond',
    faCategoryName: 'اوراق خزانه ۱۰ ساله آمریکا',
    description: 'مهم‌ترین شاخص نرخ بهره بدون ریسک و هزینه استقراض جهانی'
  },
  {
    id: 'BOND_US02Y',
    symbol: 'US 2Y YIELD',
    name: 'US 2-Year Treasury Yield',
    faName: 'بازده اوراق قرضه ۲ ساله آمریکا',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 4.14,
    change24h: 0.45,
    high24h: 4.17,
    low24h: 4.10,
    marketStatus: 'open',
    categoryName: 'US Short-Term Bond',
    faCategoryName: 'اوراق ۲ ساله آمریکا',
    description: 'حساس‌ترین نرخ به تصمیمات نرخ بهره فدرال رزرو'
  },
  {
    id: 'BOND_US30Y',
    symbol: 'US 30Y YIELD',
    name: 'US 30-Year Treasury Bond Yield',
    faName: 'بازده اوراق قرضه ۳۰ ساله آمریکا',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 4.52,
    change24h: 0.70,
    high24h: 4.56,
    low24h: 4.48,
    marketStatus: 'open',
    categoryName: 'US Long-Term Bond',
    faCategoryName: 'اوراق بلندمدت ۳۰ ساله آمریکا'
  },
  {
    id: 'BOND_US03M',
    symbol: 'US 3M T-BILL',
    name: 'US 3-Month Treasury Bill Yield',
    faName: 'بازده اسناد ۳ ماهه خزانه آمریکا',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 4.62,
    change24h: -0.10,
    high24h: 4.65,
    low24h: 4.60,
    marketStatus: 'open',
    categoryName: 'Money Market',
    faCategoryName: 'اسناد کوتاه‌مدت بازار پول آمریکا'
  },
  {
    id: 'BOND_DE10Y',
    symbol: 'GERMANY 10Y',
    name: 'German 10-Year Bund Yield',
    faName: 'بازده اوراق ۱۰ ساله آلمان (بوند)',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 2.34,
    change24h: 0.85,
    high24h: 2.38,
    low24h: 2.30,
    marketStatus: 'open',
    categoryName: 'Euro Benchmark',
    faCategoryName: 'اوراق مرجع منطقه یورو (آلمان)'
  },
  {
    id: 'BOND_UK10Y',
    symbol: 'UK 10Y GILT',
    name: 'UK 10-Year Gilt Yield',
    faName: 'بازده اوراق ۱۰ ساله بریتانیا (گیلت)',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 4.26,
    change24h: 1.15,
    high24h: 4.31,
    low24h: 4.21,
    marketStatus: 'open',
    categoryName: 'UK Sovereign',
    faCategoryName: 'اوراق دولتی انگلستان'
  },
  {
    id: 'BOND_JP10Y',
    symbol: 'JAPAN 10Y JGB',
    name: 'Japan 10-Year Bond Yield (JGB)',
    faName: 'بازده اوراق ۱۰ ساله ژاپن (JGB)',
    market: 'bonds',
    quote: '%',
    unit: '%',
    price: 0.98,
    change24h: 0.05,
    high24h: 1.01,
    low24h: 0.95,
    marketStatus: 'open',
    categoryName: 'Asia Sovereign',
    faCategoryName: 'اوراق دولتی بانک مرکزی ژاپن'
  },
];

class MultiMarketService {
  private static instance: MultiMarketService;
  private assets: Map<string, MarketAsset> = new Map();
  private listeners: Set<(assets: MarketAsset[]) => void> = new Set();
  private pollTimer: any = null;
  private usdtTomanRate = 93500;

  private constructor() {
    INITIAL_NON_CRYPTO_ASSETS.forEach((asset) => {
      this.assets.set(asset.id, { ...asset });
    });
    this.startLiveFeed();
  }

  public static getInstance(): MultiMarketService {
    if (!MultiMarketService.instance) {
      MultiMarketService.instance = new MultiMarketService();
    }
    return MultiMarketService.instance;
  }

  public getAssets(market?: MarketType): MarketAsset[] {
    const list = Array.from(this.assets.values());
    if (market && market !== 'crypto') {
      return list.filter((a) => a.market === market);
    }
    return list;
  }

  public getAssetById(id: string): MarketAsset | undefined {
    return this.assets.get(id);
  }

  public subscribe(listener: (assets: MarketAsset[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getAssets());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const list = this.getAssets();
    this.listeners.forEach((l) => l(list));
  }

  /**
   * Background Fetcher: Live European Central Bank & PAXG Gold & Binance Commodities
   */
  public async refreshFeeds() {
    // 1. Fetch live Gold Spot from PAXG / Tether Gold (1 PAXG = 1 Fine Troy Ounce Gold)
    try {
      const paxRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT');
      if (paxRes.ok) {
        const pax = await paxRes.json();
        const goldPrice = parseFloat(pax.lastPrice || '2684.50');
        const goldChange = parseFloat(pax.priceChangePercent || '0.8');
        const goldHigh = parseFloat(pax.highPrice || '2692.00');
        const goldLow = parseFloat(pax.lowPrice || '2665.00');

        const xau = this.assets.get('XAU_USD');
        if (xau) {
          xau.price = goldPrice;
          xau.change24h = goldChange;
          xau.high24h = goldHigh;
          xau.low24h = goldLow;
          xau.tomanPrice = Math.round(goldPrice * (this.usdtTomanRate / 31.1035)); // Price per gram Toman approx
        }

        // Update Silver proportionally
        const xag = this.assets.get('XAG_USD');
        if (xag) {
          xag.price = +(goldPrice / 84.5).toFixed(2);
        }
      }
    } catch (e) {}

    // 2. Fetch live Toman & Nobitex rates for Iranian Gold & Coins
    try {
      const nobiRes = await fetch('https://api.nobitex.ir/market/stats');
      if (nobiRes.ok) {
        const nobi = await nobiRes.json();
        if (nobi?.['usdt-rls']?.latest) {
          this.usdtTomanRate = Math.round(parseFloat(nobi['usdt-rls'].latest) / 10);
        }

        // Nobitex Gold/PAXG
        if (nobi?.['paxg-rls']?.latest) {
          const ounceToman = Math.round(parseFloat(nobi['paxg-rls'].latest) / 10);
          const gram18k = Math.round((ounceToman / 31.1035) * (18 / 24) * 1.02);
          const sekeEmami = Math.round(gram18k * 8.133 * 1.25); // ~8.133g with bubble

          const g18 = this.assets.get('GOLD_18K_IR');
          if (g18) {
            g18.price = gram18k;
            if (nobi['paxg-rls'].dayChange) g18.change24h = parseFloat(nobi['paxg-rls'].dayChange);
          }

          const seke = this.assets.get('SEKE_EMAMI_IR');
          if (seke) {
            seke.price = sekeEmami;
            if (nobi['paxg-rls'].dayChange) seke.change24h = parseFloat(nobi['paxg-rls'].dayChange) + 0.2;
          }
        }
      }
    } catch (e) {}

    // 3. Fetch live Forex rates (European Central Bank / Frankfurter API)
    try {
      const fxRes = await fetch('https://api.frankfurter.app/latest?from=USD');
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const rates = fxData.rates;

        if (rates.EUR) {
          const eurUsd = +(1 / rates.EUR).toFixed(4);
          const eur = this.assets.get('EUR_USD');
          if (eur) eur.price = eurUsd;
        }

        if (rates.GBP) {
          const gbpUsd = +(1 / rates.GBP).toFixed(4);
          const gbp = this.assets.get('GBP_USD');
          if (gbp) gbp.price = gbpUsd;
        }

        if (rates.JPY) {
          const jpy = this.assets.get('USD_JPY');
          if (jpy) jpy.price = +(rates.JPY).toFixed(2);
        }

        if (rates.AUD) {
          const audUsd = +(1 / rates.AUD).toFixed(4);
          const aud = this.assets.get('AUD_USD');
          if (aud) aud.price = audUsd;
        }

        if (rates.CAD) {
          const cad = this.assets.get('USD_CAD');
          if (cad) cad.price = +(rates.CAD).toFixed(4);
        }

        if (rates.CHF) {
          const chf = this.assets.get('USD_CHF');
          if (chf) chf.price = +(rates.CHF).toFixed(4);
        }

        if (rates.TRY) {
          const tryLira = this.assets.get('USD_TRY');
          if (tryLira) tryLira.price = +(rates.TRY).toFixed(2);
        }
      }
    } catch (e) {}

    this.notify();
  }

  private startLiveFeed() {
    this.refreshFeeds();
    this.pollTimer = setInterval(() => {
      this.refreshFeeds();
    }, 15000); // 15s refresh
  }

  public destroy() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }
}

export const multiMarketService = MultiMarketService.getInstance();
