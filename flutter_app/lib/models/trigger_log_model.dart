import 'dart:convert';

class TriggerLogModel {
  final String id;
  final String alertId;
  final String symbol;
  final String exchange;
  final int timestamp;
  final String type;
  final String direction;
  final double fromPrice;
  final double toPrice;
  final double targetValue;
  final double changeAmount;
  final double changePercentage;
  final String title;
  final String message;
  bool read;

  TriggerLogModel({
    required this.id,
    required this.alertId,
    required this.symbol,
    required this.exchange,
    required this.timestamp,
    required this.type,
    required this.direction,
    required this.fromPrice,
    required this.toPrice,
    required this.targetValue,
    required this.changeAmount,
    required this.changePercentage,
    required this.title,
    required this.message,
    this.read = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'alertId': alertId,
      'symbol': symbol,
      'exchange': exchange,
      'timestamp': timestamp,
      'type': type,
      'direction': direction,
      'fromPrice': fromPrice,
      'toPrice': toPrice,
      'targetValue': targetValue,
      'changeAmount': changeAmount,
      'changePercentage': changePercentage,
      'title': title,
      'message': message,
      'read': read,
    };
  }

  factory TriggerLogModel.fromMap(Map<String, dynamic> map) {
    return TriggerLogModel(
      id: map['id'] as String,
      alertId: map['alertId'] as String,
      symbol: map['symbol'] as String,
      exchange: map['exchange'] as String,
      timestamp: map['timestamp'] as int,
      type: map['type'] as String,
      direction: map['direction'] as String,
      fromPrice: (map['fromPrice'] as num).toDouble(),
      toPrice: (map['toPrice'] as num).toDouble(),
      targetValue: (map['targetValue'] as num).toDouble(),
      changeAmount: (map['changeAmount'] as num).toDouble(),
      changePercentage: (map['changePercentage'] as num).toDouble(),
      title: map['title'] as String,
      message: map['message'] as String,
      read: map['read'] as bool? ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory TriggerLogModel.fromJson(String source) =>
      TriggerLogModel.fromMap(json.decode(source) as Map<String, dynamic>);
}
