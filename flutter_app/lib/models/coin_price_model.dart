class CoinPriceModel {
  final String exchange;
  final String symbol;
  final String baseAsset;
  final String quoteAsset;
  final double price;
  final double change24h;
  final double? high24h;
  final double? low24h;
  final double? volume24h;
  final int timestamp;
  final List<double> sparkline;

  CoinPriceModel({
    required this.exchange,
    required this.symbol,
    required this.baseAsset,
    required this.quoteAsset,
    required this.price,
    required this.change24h,
    this.high24h,
    this.low24h,
    this.volume24h,
    required this.timestamp,
    this.sparkline = const [],
  });

  Map<String, dynamic> toMap() {
    return {
      'exchange': exchange,
      'symbol': symbol,
      'baseAsset': baseAsset,
      'quoteAsset': quoteAsset,
      'price': price,
      'change24h': change24h,
      'high24h': high24h,
      'low24h': low24h,
      'volume24h': volume24h,
      'timestamp': timestamp,
      'sparkline': sparkline,
    };
  }

  factory CoinPriceModel.fromMap(Map<String, dynamic> map) {
    return CoinPriceModel(
      exchange: map['exchange'] as String,
      symbol: map['symbol'] as String,
      baseAsset: map['baseAsset'] as String,
      quoteAsset: map['quoteAsset'] as String,
      price: (map['price'] as num).toDouble(),
      change24h: (map['change24h'] as num).toDouble(),
      high24h: (map['high24h'] as num?)?.toDouble(),
      low24h: (map['low24h'] as num?)?.toDouble(),
      volume24h: (map['volume24h'] as num?)?.toDouble(),
      timestamp: map['timestamp'] as int,
      sparkline: (map['sparkline'] as List<dynamic>?)
              ?.map((e) => (e as num).toDouble())
              .toList() ??
          [],
    );
  }
}
