import 'dart:convert';

class SettingsModel {
  final String language; // 'fa', 'en', 'ar', 'ru', 'de', 'es', 'zh', 'tr'
  final String theme; // 'dark', 'light'
  final bool soundEnabled;
  final double soundVolume;
  final String soundTone; // 'classic', 'ping', 'siren', 'radar', 'tts'
  final bool vibrationEnabled;
  final String vibrationPattern;
  final bool ongoingNotificationEnabled;
  final String ongoingExchange;
  final String ongoingSymbol;
  final int refreshIntervalSeconds;
  final bool persistentServiceEnabled;
  final bool wakeLockEnabled;
  final bool ttsVoiceEnabled;
  final String ttsLanguage;
  final bool hasChosenLanguage;

  SettingsModel({
    this.language = 'fa',
    this.theme = 'dark',
    this.soundEnabled = true,
    this.soundVolume = 1.0,
    this.soundTone = 'classic',
    this.vibrationEnabled = true,
    this.vibrationPattern = 'default',
    this.ongoingNotificationEnabled = true,
    this.ongoingExchange = 'Binance',
    this.ongoingSymbol = 'BTCUSDT',
    this.refreshIntervalSeconds = 5,
    this.persistentServiceEnabled = true,
    this.wakeLockEnabled = true,
    this.ttsVoiceEnabled = true,
    this.ttsLanguage = 'fa',
    this.hasChosenLanguage = true,
  });

  Map<String, dynamic> toMap() {
    return {
      'language': language,
      'theme': theme,
      'soundEnabled': soundEnabled,
      'soundVolume': soundVolume,
      'soundTone': soundTone,
      'vibrationEnabled': vibrationEnabled,
      'vibrationPattern': vibrationPattern,
      'ongoingNotificationEnabled': ongoingNotificationEnabled,
      'ongoingExchange': ongoingExchange,
      'ongoingSymbol': ongoingSymbol,
      'refreshIntervalSeconds': refreshIntervalSeconds,
      'persistentServiceEnabled': persistentServiceEnabled,
      'wakeLockEnabled': wakeLockEnabled,
      'ttsVoiceEnabled': ttsVoiceEnabled,
      'ttsLanguage': ttsLanguage,
      'hasChosenLanguage': hasChosenLanguage,
    };
  }

  factory SettingsModel.fromMap(Map<String, dynamic> map) {
    return SettingsModel(
      language: map['language'] as String? ?? 'fa',
      theme: map['theme'] as String? ?? 'dark',
      soundEnabled: map['soundEnabled'] as bool? ?? true,
      soundVolume: (map['soundVolume'] as num?)?.toDouble() ?? 1.0,
      soundTone: map['soundTone'] as String? ?? 'classic',
      vibrationEnabled: map['vibrationEnabled'] as bool? ?? true,
      vibrationPattern: map['vibrationPattern'] as String? ?? 'default',
      ongoingNotificationEnabled:
          map['ongoingNotificationEnabled'] as bool? ?? true,
      ongoingExchange: map['ongoingExchange'] as String? ?? 'Binance',
      ongoingSymbol: map['ongoingSymbol'] as String? ?? 'BTCUSDT',
      refreshIntervalSeconds: map['refreshIntervalSeconds'] as int? ?? 5,
      persistentServiceEnabled:
          map['persistentServiceEnabled'] as bool? ?? true,
      wakeLockEnabled: map['wakeLockEnabled'] as bool? ?? true,
      ttsVoiceEnabled: map['ttsVoiceEnabled'] as bool? ?? true,
      ttsLanguage: map['ttsLanguage'] as String? ?? 'fa',
      hasChosenLanguage: map['hasChosenLanguage'] as bool? ?? true,
    );
  }

  String toJson() => json.encode(toMap());

  factory SettingsModel.fromJson(String source) =>
      SettingsModel.fromMap(json.decode(source) as Map<String, dynamic>);
}
