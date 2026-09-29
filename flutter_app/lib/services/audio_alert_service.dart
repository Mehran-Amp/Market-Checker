import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:vibration/vibration.dart';
import 'storage_service.dart';

class AudioAlertService {
  static final AudioAlertService _instance = AudioAlertService._internal();
  factory AudioAlertService() => _instance;
  AudioAlertService._internal() {
    _initTts();
  }

  final AudioPlayer _audioPlayer = AudioPlayer();
  final FlutterTts _flutterTts = FlutterTts();

  Future<void> _initTts() async {
    try {
      await _flutterTts.setSpeechRate(0.5);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(1.0);
    } catch (_) {}
  }

  Future<void> playTriggerAlarm({
    required String symbol,
    required double price,
    required double changePercent,
    bool isTTSVoice = true,
    bool isLoop = false,
  }) async {
    final settings = StorageService.getSettings();
    if (!settings.soundEnabled) return;

    // 1. Play Tone
    try {
      final tone = settings.soundTone;
      String soundPath = 'sounds/classic.mp3';
      if (tone == 'ping') soundPath = 'sounds/ping.mp3';
      if (tone == 'siren') soundPath = 'sounds/siren.mp3';
      if (tone == 'radar') soundPath = 'sounds/radar.mp3';

      await _audioPlayer.setVolume(settings.soundVolume);
      if (isLoop) {
        await _audioPlayer.setReleaseMode(ReleaseMode.loop);
      } else {
        await _audioPlayer.setReleaseMode(ReleaseMode.release);
      }
      await _audioPlayer.play(AssetSource(soundPath));
    } catch (_) {}

    // 2. Vibration Pattern
    if (settings.vibrationEnabled) {
      final hasVibrator = await Vibration.hasVibrator();
      if (hasVibrator == true) {
        Vibration.vibrate(pattern: [0, 300, 150, 300, 150, 500]);
      }
    }

    // 3. Persian / English Voice TTS price announcement
    if (isTTSVoice && settings.ttsVoiceEnabled) {
      Future.delayed(const Duration(milliseconds: 1200), () async {
        try {
          final isFa = settings.ttsLanguage == 'fa' || settings.language == 'fa';
          final dirText = changePercent >= 0 ? 'افزایش' : 'کاهش';
          final pctStr = changePercent.abs().toStringAsFixed(1);
          final priceStr = price >= 1 ? price.toStringAsFixed(0) : price.toStringAsFixed(4);

          if (isFa) {
            await _flutterTts.setLanguage('fa-IR');
            await _flutterTts.speak('هشدار نماد $symbol. $dirText $pctStr درصد. قیمت $priceStr دلار');
          } else {
            await _flutterTts.setLanguage('en-US');
            final dirEn = changePercent >= 0 ? 'up' : 'down';
            await _flutterTts.speak('Alert for $symbol. $dirEn $pctStr percent. Price $priceStr dollars');
          }
        } catch (_) {}
      });
    }
  }

  void stopAlarm() {
    _audioPlayer.stop();
  }
}
