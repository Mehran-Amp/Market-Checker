import 'dart:math';
import '../models/alert_model.dart';
import '../models/trigger_log_model.dart';
import '../models/coin_price_model.dart';
import 'storage_service.dart';
import 'audio_alert_service.dart';

typedef AlertCallback = void Function(AlertModel alert, TriggerLogModel log);

class AlertEngine {
  static final AlertEngine _instance = AlertEngine._internal();
  factory AlertEngine() => _instance;
  AlertEngine._internal();

  final List<AlertCallback> _listeners = [];

  void addListener(AlertCallback listener) => _listeners.add(listener);
  void removeListener(AlertCallback listener) => _listeners.remove(listener);

  void evaluatePrice(CoinPriceModel coinPrice) {
    final alerts = StorageService.getAlerts();
    final logs = StorageService.getLogs();
    bool alertsUpdated = false;

    for (final alert in alerts) {
      if (!alert.isActive) continue;
      if (alert.exchange.toLowerCase() != coinPrice.exchange.toLowerCase() ||
          alert.symbol.toUpperCase() != coinPrice.symbol.toUpperCase()) {
        continue;
      }

      final currentPrice = coinPrice.price;
      alert.lastEvaluatedPrice = currentPrice;

      bool isTriggered = false;
      String triggerTitle = '';
      String triggerMsg = '';
      double changeAmount = 0;
      double changePercentage = 0;

      final diffFromRef = currentPrice - alert.referencePrice;
      final pctFromRef = alert.referencePrice > 0
          ? (diffFromRef / alert.referencePrice) * 100
          : 0.0;

      switch (alert.type) {
        case AlertType.percentage:
        case AlertType.repeatingPercentage:
          final targetPct = alert.targetValue;
          final isUpMatch = (alert.direction == AlertDirection.up ||
                  alert.direction == AlertDirection.both) &&
              pctFromRef >= targetPct;
          final isDownMatch = (alert.direction == AlertDirection.down ||
                  alert.direction == AlertDirection.both) &&
              pctFromRef <= -targetPct;

          if (isUpMatch || isDownMatch) {
            isTriggered = true;
            changeAmount = diffFromRef;
            changePercentage = pctFromRef;
            final arrow = isUpMatch ? '▲' : '▼';
            final sign = isUpMatch ? '+' : '';
            triggerTitle = '${alert.symbol} $arrow $sign${pctFromRef.toStringAsFixed(2)}%';
            triggerMsg =
                'Price reached \$${currentPrice.toStringAsFixed(2)} from \$${alert.referencePrice.toStringAsFixed(2)} on ${alert.exchange}.';

            if (alert.type == AlertType.repeatingPercentage) {
              // Reset reference price to lock in new baseline
              alert.referencePrice = currentPrice;
            }
          }
          break;

        case AlertType.absolutePrice:
          final targetPrice = alert.targetValue;
          final isCrossingUp = (alert.direction == AlertDirection.up ||
                  alert.direction == AlertDirection.both) &&
              currentPrice >= targetPrice &&
              alert.referencePrice < targetPrice;
          final isCrossingDown = (alert.direction == AlertDirection.down ||
                  alert.direction == AlertDirection.both) &&
              currentPrice <= targetPrice &&
              alert.referencePrice > targetPrice;

          if (isCrossingUp || isCrossingDown) {
            isTriggered = true;
            changeAmount = currentPrice - alert.referencePrice;
            changePercentage = pctFromRef;
            triggerTitle = '${alert.symbol} Target \$${targetPrice.toStringAsFixed(2)} Hit';
            triggerMsg =
                'Current price: \$${currentPrice.toStringAsFixed(2)} (${alert.exchange})';
          }
          break;

        case AlertType.stepPercentage:
        case AlertType.stepValue:
        case AlertType.trailingStop:
          final step = alert.targetValue;
          if (step > 0 && diffFromRef.abs() >= step) {
            isTriggered = true;
            changeAmount = diffFromRef;
            changePercentage = pctFromRef;
            triggerTitle = '${alert.symbol} Step Threshold Reached';
            triggerMsg = 'Delta: \$${diffFromRef.toStringAsFixed(2)}';
            alert.referencePrice = currentPrice;
          }
          break;
      }

      if (isTriggered) {
        alert.triggerCount += 1;
        alert.lastTriggerTime = DateTime.now().millisecondsSinceEpoch;
        alert.lastTriggeredPrice = currentPrice;
        alert.hasUnreadTrigger = true;

        if (alert.isOneShot) {
          alert.isActive = false;
        }

        alertsUpdated = true;

        final newLog = TriggerLogModel(
          id: 'log_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}',
          alertId: alert.id,
          symbol: alert.symbol,
          exchange: alert.exchange,
          timestamp: DateTime.now().millisecondsSinceEpoch,
          type: alert.type.name,
          direction: alert.direction.name,
          fromPrice: alert.referencePrice,
          toPrice: currentPrice,
          targetValue: alert.targetValue,
          changeAmount: changeAmount,
          changePercentage: changePercentage,
          title: triggerTitle,
          message: triggerMsg,
          read: false,
        );

        logs.insert(0, newLog);
        StorageService.saveLogs(logs);

        // Trigger Audio Alarm and Voice TTS
        AudioAlertService().playTriggerAlarm(
          symbol: alert.symbol,
          price: currentPrice,
          changePercent: changePercentage,
          isTTSVoice: alert.isTTSVoice,
          isLoop: alert.isAlarmLoop,
        );

        for (final l in _listeners) {
          l(alert, newLog);
        }
      }
    }

    if (alertsUpdated) {
      StorageService.saveAlerts(alerts);
    }
  }
}
