enum MarketType {
  crypto,
  forex,
  metals,
  energy,
  stocks,
  indices,
  bonds,
}

class MarketAssetModel {
  final String id;
  final String symbol;
  final String name;
  final String faName;
  final MarketType market;
  final String categoryName;
  final String faCategoryName;
  final String exchange;
  final String quoteAsset;
  final double price;
  final double change24h;
  final double? high24h;
  final double? low24h;
  final String? unit;
  final String? faUnit;
  final List<double> sparkline;

  MarketAssetModel({
    required this.id,
    required this.symbol,
    required this.name,
    required this.faName,
    required this.market,
    required this.categoryName,
    required this.faCategoryName,
    required this.exchange,
    required this.quoteAsset,
    required this.price,
    required this.change24h,
    this.high24h,
    this.low24h,
    this.unit,
    this.faUnit,
    this.sparkline = const [],
  });
}
