import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/alert_model.dart';
import '../models/settings_model.dart';
import '../models/trigger_log_model.dart';

class StorageService {
  static const String _alertsKey = 'mc_alerts';
  static const String _settingsKey = 'mc_settings';
  static const String _logsKey = 'mc_trigger_logs';

  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static List<AlertModel> getAlerts() {
    final raw = _prefs?.getStringList(_alertsKey);
    if (raw == null || raw.isEmpty) {
      // Provide default BitcoinChecker alerts
      return [
        AlertModel(
          id: 'default_btc_1',
          exchange: 'Binance',
          symbol: 'BTCUSDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          type: AlertType.repeatingPercentage,
          direction: AlertDirection.both,
          targetValue: 1.0,
          referencePrice: 67200.0,
          isOneShot: false,
          isTTSVoice: true,
          isAlarmLoop: false,
          note: 'Repeating 1% Movement',
        ),
        AlertModel(
          id: 'default_eth_1',
          exchange: 'Binance',
          symbol: 'ETHUSDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          type: AlertType.repeatingPercentage,
          direction: AlertDirection.both,
          targetValue: 2.0,
          referencePrice: 3450.0,
          isOneShot: false,
          isTTSVoice: true,
          note: 'Repeating 2% Movement',
        ),
      ];
    }
    return raw.map((str) => AlertModel.fromJson(str)).toList();
  }

  static Future<void> saveAlerts(List<AlertModel> alerts) async {
    final raw = alerts.map((a) => a.toJson()).toList();
    await _prefs?.setStringList(_alertsKey, raw);
  }

  static SettingsModel getSettings() {
    final raw = _prefs?.getString(_settingsKey);
    if (raw == null) return SettingsModel();
    return SettingsModel.fromJson(raw);
  }

  static Future<void> saveSettings(SettingsModel settings) async {
    await _prefs?.setString(_settingsKey, settings.toJson());
  }

  static List<TriggerLogModel> getLogs() {
    final raw = _prefs?.getStringList(_logsKey);
    if (raw == null) return [];
    return raw.map((str) => TriggerLogModel.fromJson(str)).toList();
  }

  static Future<void> saveLogs(List<TriggerLogModel> logs) async {
    final raw = logs.take(200).map((l) => l.toJson()).toList();
    await _prefs?.setStringList(_logsKey, raw);
  }

  static String exportFullBackup() {
    final data = {
      'version': '1.0.0',
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'alerts': getAlerts().map((a) => a.toMap()).toList(),
      'settings': getSettings().toMap(),
      'logs': getLogs().map((l) => l.toMap()).toList(),
    };
    return json.encode(data);
  }

  static bool importBackup(String jsonStr) {
    try {
      final map = json.decode(jsonStr) as Map<String, dynamic>;
      if (map.containsKey('alerts')) {
        final alertsList = (map['alerts'] as List)
            .map((e) => AlertModel.fromMap(e as Map<String, dynamic>))
            .toList();
        saveAlerts(alertsList);
      }
      if (map.containsKey('settings')) {
        saveSettings(
            SettingsModel.fromMap(map['settings'] as Map<String, dynamic>));
      }
      return true;
    } catch (_) {
      return false;
    }
  }
}
