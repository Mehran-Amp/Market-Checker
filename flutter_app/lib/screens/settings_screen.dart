import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../models/settings_model.dart';
import '../services/storage_service.dart';
import '../services/audio_alert_service.dart';

class SettingsScreen extends StatefulWidget {
  final SettingsModel settings;
  final VoidCallback onSettingsChanged;

  const SettingsScreen({
    Key? key,
    required this.settings,
    required this.onSettingsChanged,
  }) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late SettingsModel _current;

  @override
  void initState() {
    super.initState();
    _current = widget.settings;
  }

  void _update(SettingsModel updated) {
    setState(() => _current = updated);
    StorageService.saveSettings(updated);
    widget.onSettingsChanged();
  }

  @override
  Widget build(BuildContext context) {
    final isFa = _current.language == 'fa';
    final isDark = _current.theme == 'dark';
    final cardBg = isDark ? const Color(0xFF111726) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);

    return Scaffold(
      appBar: AppBar(
        title: Text(isFa ? 'تنظیمات و سفارشی‌سازی' : 'Settings & Preferences'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Audio Section
          Text(
            isFa ? 'صدا و هشدارهای صوتی' : 'Sound & Audio Alerts',
            style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            title: Text(isFa ? 'فعال بودن صدای آلارم' : 'Enable Alarm Sounds'),
            value: _current.soundEnabled,
            activeColor: const Color(0xFF10B981),
            onChanged: (v) => _update(_current = SettingsModel.fromMap({..._current.toMap(), 'soundEnabled': v})),
          ),
          SwitchListTile(
            title: Text(isFa ? 'گوینده صوتی فارسی / انگلیسی (TTS)' : 'Voice TTS Announcer'),
            subtitle: Text(isFa ? 'خواندن قیمت و درصد نوسان با صدای طبیعی' : 'Speaks coin price on trigger'),
            value: _current.ttsVoiceEnabled,
            activeColor: const Color(0xFF10B981),
            onChanged: (v) => _update(_current = SettingsModel.fromMap({..._current.toMap(), 'ttsVoiceEnabled': v})),
          ),
          ListTile(
            title: Text(isFa ? 'تست صدای زنگ و گوینده' : 'Test Sound & Voice'),
            trailing: IconButton(
              icon: const Icon(Icons.play_circle_fill, color: Color(0xFFF59E0B), size: 28),
              onPressed: () {
                AudioAlertService().playTriggerAlarm(
                  symbol: 'BTCUSDT',
                  price: 67500.0,
                  changePercent: 1.5,
                  isTTSVoice: _current.ttsVoiceEnabled,
                );
              },
            ),
          ),
          const Divider(),

          // Foreground BitcoinChecker Notification
          Text(
            isFa ? 'تیکر دائمی پس‌زمینه (BitcoinChecker)' : 'Persistent Background Ticker',
            style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            title: Text(isFa ? 'نمایش قیمت در استاتوس‌بار اندروید' : 'Show Live Ticker in Status Bar'),
            subtitle: Text(isFa ? 'به‌روزرسانی پیوسته حتی در صفحه قفل' : 'Runs continuous data sync'),
            value: _current.ongoingNotificationEnabled,
            activeColor: const Color(0xFF10B981),
            onChanged: (v) => _update(_current = SettingsModel.fromMap({..._current.toMap(), 'ongoingNotificationEnabled': v})),
          ),
          const Divider(),

          // Backup & Sync
          Text(
            isFa ? 'پشتیبان‌گیری و خروجی' : 'Backup & Export',
            style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          ListTile(
            leading: const Icon(Icons.download, color: Color(0xFFF59E0B)),
            title: Text(isFa ? 'اشتراک‌گذاری و خروجی JSON' : 'Export JSON Backup'),
            onTap: () {
              final jsonStr = StorageService.exportFullBackup();
              Share.share(jsonStr, subject: 'Market_Checker_Backup.json');
            },
          ),
        ],
      ),
    );
  }
}
