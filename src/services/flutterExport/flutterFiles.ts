export interface FlutterFileItem {
  filename: string;
  path: string;
  category: 'Adapter' | 'Engine' | 'Service' | 'Database' | 'UI' | 'Config';
  description: string;
  content: string;
}

export const FLUTTER_CODEBASE: FlutterFileItem[] = [
  {
    filename: 'exchange_adapter.dart',
    path: 'lib/services/exchange_adapter.dart',
    category: 'Adapter',
    description: 'Common interface & unified CoinPrice model for Binance, OKX, and MEXC',
    content: `import 'dart:async';

class CoinPrice {
  final String exchange; // "Binance" / "OKX" / "MEXC"
  final String symbol; // "BTCUSDT"
  final double price; // Latest price
  final double change24h; // 24h change %
  final double high24h;
  final double low24h;
  final double volume24h;
  final DateTime timestamp;

  CoinPrice({
    required this.exchange,
    required this.symbol,
    required this.price,
    required this.change24h,
    required this.high24h,
    required this.low24h,
    required this.volume24h,
    required this.timestamp,
  });
}

class SymbolInfo {
  final String symbol;
  final String baseAsset;
  final String quoteAsset;
  final String displayName;

  SymbolInfo({
    required this.symbol,
    required this.baseAsset,
    required this.quoteAsset,
    required this.displayName,
  });
}

abstract class ExchangeAdapter {
  String get exchangeName;

  /// Fetch tradable symbols list
  Future<List<SymbolInfo>> fetchSymbols();

  /// Connect WebSocket and stream live prices for specified symbols
  Stream<CoinPrice> connect(List<String> symbols);

  /// Disconnect stream
  Future<void> disconnect();
}
`
  },
  {
    filename: 'binance_adapter.dart',
    path: 'lib/services/binance_adapter.dart',
    category: 'Adapter',
    description: 'Binance Combined Stream WebSocket with heartbeat pong response',
    content: `import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'exchange_adapter.dart';

class BinanceAdapter implements ExchangeAdapter {
  @override
  String get exchangeName => 'Binance';

  WebSocketChannel? _channel;
  StreamController<CoinPrice>? _controller;
  Timer? _reconnectTimer;

  @override
  Future<List<SymbolInfo>> fetchSymbols() async {
    return [
      SymbolInfo(symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', displayName: 'Bitcoin'),
      SymbolInfo(symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', displayName: 'Ethereum'),
      SymbolInfo(symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', displayName: 'Solana'),
    ];
  }

  @override
  Stream<CoinPrice> connect(List<String> symbols) {
    _controller = StreamController<CoinPrice>.broadcast();
    _connectInternal(symbols);
    return _controller!.stream;
  }

  void _connectInternal(List<String> symbols) {
    if (symbols.isEmpty) return;
    
    // Lowercase combined stream: btcusdt@ticker/ethusdt@ticker
    final streams = symbols.map((s) => '\${s.toLowerCase()}@ticker').join('/');
    final uri = Uri.parse('wss://stream.binance.com:9443/stream?streams=$streams');

    _channel = WebSocketChannel.connect(uri);

    _channel!.stream.listen(
      (message) {
        try {
          if (message == 'ping') {
            _channel?.sink.add('pong');
            return;
          }
          final decoded = jsonDecode(message);
          if (decoded['stream'] != null && decoded['data'] != null) {
            final data = decoded['data'];
            final symbol = (data['s'] as String? ?? '').toUpperCase();
            final price = double.tryParse(data['c']?.toString() ?? '0') ?? 0.0;
            final change24h = double.tryParse(data['P']?.toString() ?? '0') ?? 0.0;
            final high = double.tryParse(data['h']?.toString() ?? '0') ?? 0.0;
            final low = double.tryParse(data['l']?.toString() ?? '0') ?? 0.0;
            final vol = double.tryParse(data['v']?.toString() ?? '0') ?? 0.0;

            if (price > 0 && !_controller!.isClosed) {
              _controller!.add(CoinPrice(
                exchange: exchangeName,
                symbol: symbol,
                price: price,
                change24h: change24h,
                high24h: high,
                low24h: low,
                volume24h: vol,
                timestamp: DateTime.now(),
              ));
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      },
      onError: (err) => _scheduleReconnect(symbols),
      onDone: () => _scheduleReconnect(symbols),
    );
  }

  void _scheduleReconnect(List<String> symbols) {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () => _connectInternal(symbols));
  }

  @override
  Future<void> disconnect() async {
    _reconnectTimer?.cancel();
    await _channel?.sink.close();
    await _controller?.close();
  }
}
`
  },
  {
    filename: 'okx_adapter.dart',
    path: 'lib/services/okx_adapter.dart',
    category: 'Adapter',
    description: 'OKX WebSocket Adapter with 20s PING heartbeat and hyphenated pairs',
    content: `import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'exchange_adapter.dart';

class OKXAdapter implements ExchangeAdapter {
  @override
  String get exchangeName => 'OKX';

  WebSocketChannel? _channel;
  StreamController<CoinPrice>? _controller;
  Timer? _pingTimer;

  @override
  Future<List<SymbolInfo>> fetchSymbols() async => [];

  @override
  Stream<CoinPrice> connect(List<String> symbols) {
    _controller = StreamController<CoinPrice>.broadcast();
    final uri = Uri.parse('wss://wsaws.okx.com:8443/ws/v5/public');
    _channel = WebSocketChannel.connect(uri);

    // Format: BTC-USDT
    final args = symbols.map((s) {
      final clean = s.toUpperCase();
      final instId = clean.endsWith('USDT') ? '\${clean.substring(0, clean.length - 4)}-USDT' : clean;
      return {'channel': 'tickers', 'instId': instId};
    }).toList();

    _channel!.sink.add(jsonEncode({'op': 'subscribe', 'args': args}));

    _pingTimer = Timer.periodic(const Duration(seconds: 20), (_) {
      _channel?.sink.add('ping');
    });

    _channel!.stream.listen((message) {
      if (message == 'pong') return;
      try {
        final decoded = jsonDecode(message);
        if (decoded['arg']?['channel'] == 'tickers' && decoded['data'] is List) {
          final data = decoded['data'][0];
          final rawInst = data['instId'] as String? ?? '';
          final stdSymbol = rawInst.replaceAll('-', '').toUpperCase();
          final last = double.tryParse(data['last']?.toString() ?? '0') ?? 0;
          final open24 = double.tryParse(data['open24h']?.toString() ?? '0') ?? 0;
          final change24h = open24 > 0 ? ((last - open24) / open24) * 100 : 0.0;

          if (last > 0 && !_controller!.isClosed) {
            _controller!.add(CoinPrice(
              exchange: exchangeName,
              symbol: stdSymbol,
              price: last,
              change24h: change24h,
              high24h: double.tryParse(data['high24h']?.toString() ?? '0') ?? 0,
              low24h: double.tryParse(data['low24h']?.toString() ?? '0') ?? 0,
              volume24h: double.tryParse(data['vol24h']?.toString() ?? '0') ?? 0,
              timestamp: DateTime.now(),
            ));
          }
        }
      } catch (e) {}
    });

    return _controller!.stream;
  }

  @override
  Future<void> disconnect() async {
    _pingTimer?.cancel();
    await _channel?.sink.close();
    await _controller?.close();
  }
}
`
  },
  {
    filename: 'mexc_adapter.dart',
    path: 'lib/services/mexc_adapter.dart',
    category: 'Adapter',
    description: 'MEXC WebSocket Adapter with miniTicker channel and PING heartbeat',
    content: `import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'exchange_adapter.dart';

class MEXCAdapter implements ExchangeAdapter {
  @override
  String get exchangeName => 'MEXC';

  WebSocketChannel? _channel;
  StreamController<CoinPrice>? _controller;
  Timer? _pingTimer;

  @override
  Future<List<SymbolInfo>> fetchSymbols() async => [];

  @override
  Stream<CoinPrice> connect(List<String> symbols) {
    _controller = StreamController<CoinPrice>.broadcast();
    final uri = Uri.parse('wss://wbs.mexc.com/ws');
    _channel = WebSocketChannel.connect(uri);

    final params = symbols.map((s) => 'spot@public.miniTicker.v3.api@\${s.toUpperCase()}').toList();
    _channel!.sink.add(jsonEncode({'method': 'SUBSCRIPTION', 'params': params}));

    _pingTimer = Timer.periodic(const Duration(seconds: 20), (_) {
      _channel?.sink.add(jsonEncode({'method': 'PING'}));
    });

    _channel!.stream.listen((message) {
      try {
        final decoded = jsonDecode(message);
        if (decoded['c'] != null && decoded['d'] != null) {
          final rawSymbol = (decoded['c'] as String).split('@').last;
          final data = decoded['d'];
          final price = double.tryParse(data['p']?.toString() ?? data['c']?.toString() ?? '0') ?? 0;
          final change24h = (double.tryParse(data['tr']?.toString() ?? data['r']?.toString() ?? '0') ?? 0) * 100;

          if (price > 0 && !_controller!.isClosed) {
            _controller!.add(CoinPrice(
              exchange: exchangeName,
              symbol: rawSymbol.toUpperCase(),
              price: price,
              change24h: change24h,
              high24h: double.tryParse(data['h']?.toString() ?? '0') ?? 0,
              low24h: double.tryParse(data['l']?.toString() ?? '0') ?? 0,
              volume24h: double.tryParse(data['v']?.toString() ?? '0') ?? 0,
              timestamp: DateTime.now(),
            ));
          }
        }
      } catch (e) {}
    });

    return _controller!.stream;
  }

  @override
  Future<void> disconnect() async {
    _pingTimer?.cancel();
    await _channel?.sink.close();
    await _controller?.close();
  }
}
`
  },
  {
    filename: 'alert_model.dart',
    path: 'lib/models/alert_model.dart',
    category: 'Engine',
    description: 'Hive Type Adapter and Alert Model with directional trigger rules',
    content: `import 'package:hive/hive.dart';

part 'alert_model.g.dart';

@HiveType(typeId: 0)
enum AlertType {
  @HiveField(0)
  priceTarget,

  @HiveField(1)
  repeatingPercentage,

  @HiveField(2)
  repeatingAbsolute,
}

@HiveType(typeId: 1)
enum AlertDirection {
  @HiveField(0)
  upOnly,

  @HiveField(1)
  downOnly,

  @HiveField(2)
  both,
}

@HiveType(typeId: 2)
class Alert extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String exchange; // Binance / OKX / MEXC

  @HiveField(2)
  final String symbol; // BTCUSDT

  @HiveField(3)
  final AlertType type;

  @HiveField(4)
  final double targetValue;

  @HiveField(5)
  double referencePrice;

  @HiveField(6)
  final AlertDirection direction;

  @HiveField(7)
  bool isActive;

  @HiveField(8)
  bool hasUnreadTrigger;

  @HiveField(9)
  final DateTime createdAt;

  @HiveField(10)
  DateTime? lastTriggeredAt;

  Alert({
    required this.id,
    required this.exchange,
    required this.symbol,
    required this.type,
    required this.targetValue,
    required this.referencePrice,
    required this.direction,
    this.isActive = true,
    this.hasUnreadTrigger = false,
    required this.createdAt,
    this.lastTriggeredAt,
  });
}
`
  },
  {
    filename: 'alert_engine.dart',
    path: 'lib/services/alert_engine.dart',
    category: 'Engine',
    description: 'High performance Alert Evaluation engine and notification dispatcher',
    content: `import '../models/alert_model.dart';
import 'notification_service.dart';

class AlertEngine {
  static bool shouldTrigger(Alert alert, double currentPrice) {
    if (!alert.isActive) return false;

    switch (alert.type) {
      case AlertType.priceTarget:
        if (alert.direction == AlertDirection.upOnly) {
          return currentPrice >= alert.targetValue;
        } else if (alert.direction == AlertDirection.downOnly) {
          return currentPrice <= alert.targetValue;
        } else {
          return alert.targetValue >= alert.referencePrice 
            ? currentPrice >= alert.targetValue 
            : currentPrice <= alert.targetValue;
        }

      case AlertType.repeatingPercentage:
        final changePct = ((currentPrice - alert.referencePrice) / alert.referencePrice) * 100;
        if (alert.direction == AlertDirection.upOnly) {
          return changePct >= alert.targetValue;
        } else if (alert.direction == AlertDirection.downOnly) {
          return changePct <= -alert.targetValue;
        } else {
          return changePct.abs() >= alert.targetValue;
        }

      case AlertType.repeatingAbsolute:
        final change = currentPrice - alert.referencePrice;
        if (alert.direction == AlertDirection.upOnly) {
          return change >= alert.targetValue;
        } else if (alert.direction == AlertDirection.downOnly) {
          return change <= -alert.targetValue;
        } else {
          return change.abs() >= alert.targetValue;
        }
    }
  }

  static void onAlertTriggered(Alert alert, double currentPrice) {
    // Send System Notification
    NotificationService.sendAlertNotification(alert, currentPrice);

    alert.hasUnreadTrigger = true;
    alert.lastTriggeredAt = DateTime.now();

    if (alert.type == AlertType.priceTarget) {
      alert.isActive = false; // One-time target
    } else {
      alert.referencePrice = currentPrice; // Reset reference price for next repeating step
    }

    alert.save(); // Persist to Hive box
  }
}
`
  },
  {
    filename: 'foreground_service.dart',
    path: 'lib/services/foreground_service.dart',
    category: 'Service',
    description: 'Android Foreground Service with dataSync type and persistent silent notification',
    content: `import 'dart:async';
import 'dart:ui';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/alert_model.dart';
import 'binance_adapter.dart';
import 'okx_adapter.dart';
import 'mexc_adapter.dart';
import 'alert_engine.dart';

Future<void> initializeForegroundService() async {
  final service = FlutterBackgroundService();

  const AndroidNotificationChannel channel = AndroidNotificationChannel(
    'crypto_service_channel',
    'Crypto Price Monitor',
    description: 'Persistent background socket for crypto price alerts',
    importance: Importance.low,
  );

  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
  await flutterLocalNotificationsPlugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.createNotificationChannel(channel);

  await service.configure(
    androidConfiguration: AndroidConfiguration(
      onStart: onStartForegroundService,
      autoStart: true,
      isForegroundMode: true,
      notificationChannelId: 'crypto_service_channel',
      initialNotificationTitle: 'Crypto Alert Service Active',
      initialNotificationContent: 'Monitoring Binance, OKX & MEXC feeds',
      foregroundServiceTypes: [AndroidForegroundType.dataSync],
    ),
    iosConfiguration: IosConfiguration(),
  );
}

@pragma('vm:entry-point')
void onStartForegroundService(ServiceInstance service) async {
  DartPluginRegistrant.ensureInitialized();
  await Hive.initFlutter();
  Hive.registerAdapter(AlertAdapter());
  Hive.registerAdapter(AlertTypeAdapter());
  Hive.registerAdapter(AlertDirectionAdapter());

  final box = await Hive.openBox<Alert>('alerts');

  final binance = BinanceAdapter();
  final okx = OKXAdapter();
  final mexc = MEXCAdapter();

  // Group active symbols by exchange
  final binanceSymbols = box.values.where((a) => a.isActive && a.exchange == 'Binance').map((a) => a.symbol).toSet().toList();
  final okxSymbols = box.values.where((a) => a.isActive && a.exchange == 'OKX').map((a) => a.symbol).toSet().toList();
  final mexcSymbols = box.values.where((a) => a.isActive && a.exchange == 'MEXC').map((a) => a.symbol).toSet().toList();

  void handlePrice(String exchange, String symbol, double price) {
    for (var alert in box.values) {
      if (alert.isActive && alert.exchange == exchange && alert.symbol == symbol) {
        if (AlertEngine.shouldTrigger(alert, price)) {
          AlertEngine.onAlertTriggered(alert, price);
        }
      }
    }
  }

  if (binanceSymbols.isNotEmpty) {
    binance.connect(binanceSymbols).listen((cp) => handlePrice(cp.exchange, cp.symbol, cp.price));
  }
  if (okxSymbols.isNotEmpty) {
    okx.connect(okxSymbols).listen((cp) => handlePrice(cp.exchange, cp.symbol, cp.price));
  }
  if (mexcSymbols.isNotEmpty) {
    mexc.connect(mexcSymbols).listen((cp) => handlePrice(cp.exchange, cp.symbol, cp.price));
  }
}
`
  },
  {
    filename: 'pubspec.yaml',
    path: 'pubspec.yaml',
    category: 'Config',
    description: 'Flutter dependencies specification for Market Checker',
    content: `name: market_checker
description: Modern 24/7 background crypto price & alert monitor inspired by Bitcoin Checker.
version: 1.0.0+1
environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  web_socket_channel: ^2.4.0
  dio: ^5.4.0
  flutter_local_notifications: ^17.0.0
  flutter_background_service: ^5.0.0
  flutter_background_service_android: ^6.0.0
  flutter_tts: ^3.8.5
  audioplayers: ^5.2.1
  google_fonts: ^6.1.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  hive_generator: ^2.0.1
  build_runner: ^2.4.8
`
  }
];
