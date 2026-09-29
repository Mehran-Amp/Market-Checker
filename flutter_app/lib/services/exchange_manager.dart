import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/coin_price_model.dart';
import 'alert_engine.dart';

typedef PriceUpdateCallback = void Function(CoinPriceModel price);

class ExchangeManager {
  static final ExchangeManager _instance = ExchangeManager._internal();
  factory ExchangeManager() => _instance;
  ExchangeManager._internal();

  final Map<String, CoinPriceModel> _latestPrices = {};
  final List<PriceUpdateCallback> _listeners = [];
  WebSocketChannel? _binanceChannel;
  Timer? _pollingTimer;

  Map<String, CoinPriceModel> get latestPrices => _latestPrices;

  void addListener(PriceUpdateCallback listener) => _listeners.add(listener);
  void removeListener(PriceUpdateCallback listener) => _listeners.remove(listener);

  void start() {
    _connectBinance();
    _startSimulatedFeeds();
  }

  void _connectBinance() {
    try {
      const url =
          'wss://stream.binance.com:9443/ws/!miniTicker@arr';
      _binanceChannel = WebSocketChannel.connect(Uri.parse(url));

      _binanceChannel?.stream.listen(
        (data) {
          try {
            final list = json.decode(data) as List;
            for (final item in list) {
              final s = item['s'] as String; // Symbol e.g. BTCUSDT
              final c = double.tryParse(item['c'].toString()) ?? 0.0; // Close price
              final o = double.tryParse(item['o'].toString()) ?? c; // Open price
              final h = double.tryParse(item['h'].toString()) ?? c;
              final l = double.tryParse(item['l'].toString()) ?? c;
              final v = double.tryParse(item['v'].toString()) ?? 0.0;
              final change24h = o > 0 ? ((c - o) / o) * 100 : 0.0;

              final coinPrice = CoinPriceModel(
                exchange: 'Binance',
                symbol: s,
                baseAsset: s.replaceAll('USDT', ''),
                quoteAsset: 'USDT',
                price: c,
                change24h: change24h,
                high24h: h,
                low24h: l,
                volume24h: v,
                timestamp: DateTime.now().millisecondsSinceEpoch,
              );

              final key = 'Binance_$s';
              _latestPrices[key] = coinPrice;

              // Send to listeners & alert engine
              for (final l in _listeners) {
                l(coinPrice);
              }
              AlertEngine().evaluatePrice(coinPrice);
            }
          } catch (_) {}
        },
        onError: (err) {
          Future.delayed(const Duration(seconds: 5), () => _connectBinance());
        },
        onDone: () {
          Future.delayed(const Duration(seconds: 5), () => _connectBinance());
        },
      );
    } catch (_) {}
  }

  void _startSimulatedFeeds() {
    _pollingTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      // Simulate/fallback ticks if socket is buffering
      final defaultCoins = [
        {'s': 'BTCUSDT', 'b': 'BTC', 'p': 67450.0, 'ch': 1.8},
        {'s': 'ETHUSDT', 'b': 'ETH', 'p': 3520.0, 'ch': -0.6},
        {'s': 'SOLUSDT', 'b': 'SOL', 'p': 158.0, 'ch': 3.4},
        {'s': 'BNBUSDT', 'b': 'BNB', 'p': 590.0, 'ch': 0.2},
        {'s': 'XRPUSDT', 'b': 'XRP', 'p': 0.58, 'ch': 1.1},
        {'s': 'DOGEUSDT', 'b': 'DOGE', 'p': 0.128, 'ch': 4.5},
      ];

      for (final item in defaultCoins) {
        final sym = item['s'] as String;
        final base = item['b'] as String;
        final key = 'Binance_$sym';
        if (!_latestPrices.containsKey(key)) {
          final p = CoinPriceModel(
            exchange: 'Binance',
            symbol: sym,
            baseAsset: base,
            quoteAsset: 'USDT',
            price: item['p'] as double,
            change24h: item['ch'] as double,
            timestamp: DateTime.now().millisecondsSinceEpoch,
          );
          _latestPrices[key] = p;
          for (final l in _listeners) {
            l(p);
          }
          AlertEngine().evaluatePrice(p);
        }
      }
    });
  }

  void stop() {
    _binanceChannel?.sink.close();
    _pollingTimer?.cancel();
  }
}
