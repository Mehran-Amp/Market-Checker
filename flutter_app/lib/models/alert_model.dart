import 'dart:convert';

enum AlertType {
  percentage,
  repeatingPercentage,
  stepPercentage,
  stepValue,
  absolutePrice,
  trailingStop,
}

enum AlertDirection {
  up,
  down,
  both,
}

class AlertModel {
  final String id;
  final String exchange;
  final String symbol;
  final String baseAsset;
  final String quoteAsset;
  final AlertType type;
  final AlertDirection direction;
  final double targetValue;
  final double referencePrice;
  double lastTriggeredPrice;
  double lastEvaluatedPrice;
  int triggerCount;
  int lastTriggerTime;
  bool isOneShot;
  bool isTTSVoice;
  bool isAlarmLoop;
  bool isOverrideSilent;
  bool isPersistentNotification;
  bool isActive;
  bool hasUnreadTrigger;
  final int createdAt;
  final String note;

  AlertModel({
    required this.id,
    required this.exchange,
    required this.symbol,
    required this.baseAsset,
    required this.quoteAsset,
    required this.type,
    required this.direction,
    required this.targetValue,
    required this.referencePrice,
    double? lastTriggeredPrice,
    double? lastEvaluatedPrice,
    this.triggerCount = 0,
    this.lastTriggerTime = 0,
    this.isOneShot = false,
    this.isTTSVoice = true,
    this.isAlarmLoop = false,
    this.isOverrideSilent = false,
    this.isPersistentNotification = true,
    this.isActive = true,
    this.hasUnreadTrigger = false,
    int? createdAt,
    this.note = '',
  })  : lastTriggeredPrice = lastTriggeredPrice ?? referencePrice,
        lastEvaluatedPrice = lastEvaluatedPrice ?? referencePrice,
        createdAt = createdAt ?? DateTime.now().millisecondsSinceEpoch;

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'exchange': exchange,
      'symbol': symbol,
      'baseAsset': baseAsset,
      'quoteAsset': quoteAsset,
      'type': type.name,
      'direction': direction.name,
      'targetValue': targetValue,
      'referencePrice': referencePrice,
      'lastTriggeredPrice': lastTriggeredPrice,
      'lastEvaluatedPrice': lastEvaluatedPrice,
      'triggerCount': triggerCount,
      'lastTriggerTime': lastTriggerTime,
      'isOneShot': isOneShot,
      'isTTSVoice': isTTSVoice,
      'isAlarmLoop': isAlarmLoop,
      'isOverrideSilent': isOverrideSilent,
      'isPersistentNotification': isPersistentNotification,
      'isActive': isActive,
      'hasUnreadTrigger': hasUnreadTrigger,
      'createdAt': createdAt,
      'note': note,
    };
  }

  factory AlertModel.fromMap(Map<String, dynamic> map) {
    return AlertModel(
      id: map['id'] as String,
      exchange: map['exchange'] as String,
      symbol: map['symbol'] as String,
      baseAsset: map['baseAsset'] as String,
      quoteAsset: map['quoteAsset'] as String,
      type: AlertType.values.firstWhere(
        (e) => e.name == map['type'],
        orElse: () => AlertType.percentage,
      ),
      direction: AlertDirection.values.firstWhere(
        (e) => e.name == map['direction'],
        orElse: () => AlertDirection.both,
      ),
      targetValue: (map['targetValue'] as num).toDouble(),
      referencePrice: (map['referencePrice'] as num).toDouble(),
      lastTriggeredPrice: (map['lastTriggeredPrice'] as num?)?.toDouble(),
      lastEvaluatedPrice: (map['lastEvaluatedPrice'] as num?)?.toDouble(),
      triggerCount: map['triggerCount'] as int? ?? 0,
      lastTriggerTime: map['lastTriggerTime'] as int? ?? 0,
      isOneShot: map['isOneShot'] as bool? ?? false,
      isTTSVoice: map['isTTSVoice'] as bool? ?? true,
      isAlarmLoop: map['isAlarmLoop'] as bool? ?? false,
      isOverrideSilent: map['isOverrideSilent'] as bool? ?? false,
      isPersistentNotification: map['isPersistentNotification'] as bool? ?? true,
      isActive: map['isActive'] as bool? ?? true,
      hasUnreadTrigger: map['hasUnreadTrigger'] as bool? ?? false,
      createdAt: map['createdAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
      note: map['note'] as String? ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory AlertModel.fromJson(String source) =>
      AlertModel.fromMap(json.decode(source) as Map<String, dynamic>);
}
