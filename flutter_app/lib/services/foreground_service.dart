import 'dart:isolate';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'storage_service.dart';

@pragma('vm:entry-point')
void startCallback() {
  FlutterForegroundTask.setTaskHandler(MarketCheckerTaskHandler());
}

class MarketCheckerTaskHandler extends TaskHandler {
  @override
  Future<void> onStart(DateTime timestamp, SendPort? sendPort) async {
    // Initial start
  }

  @override
  Future<void> onRepeatEvent(DateTime timestamp, SendPort? sendPort) async {
    final settings = StorageService.getSettings();
    if (!settings.ongoingNotificationEnabled) return;

    FlutterForegroundTask.updateService(
      notificationTitle: 'Market Checker · ${settings.ongoingExchange}',
      notificationText: '${settings.ongoingSymbol} Live Background Tracking Active',
    );
  }

  @override
  Future<void> onDestroy(DateTime timestamp, SendPort? sendPort) async {}

  @override
  void onNotificationButtonPressed(String id) {}

  @override
  void onNotificationPressed() {
    FlutterForegroundTask.launchApp('/');
  }
}

class ForegroundServiceManager {
  static Future<void> init() async {
    FlutterForegroundTask.init(
      androidNotificationOptions: AndroidNotificationOptions(
        channelId: 'market_checker_ongoing',
        channelName: 'Market Checker Live Ticker',
        channelDescription:
            'Continuous background live price tracker and alarm engine',
        channelImportance: NotificationImportance.HIGH,
        priority: NotificationPriority.HIGH,
        iconData: const NotificationIconData(
          resType: ResourceType.mipmap,
          resPrefix: ResourcePrefix.ic,
          name: 'launcher_icon',
        ),
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
        playSound: false,
      ),
      foregroundTaskOptions: const ForegroundTaskOptions(
        interval: 5000,
        isOnceEvent: false,
        autoRunOnBoot: true,
        allowWakeLock: true,
        allowWifiLock: true,
      ),
    );
  }

  static Future<void> startService() async {
    if (await FlutterForegroundTask.isRunningService) return;
    await FlutterForegroundTask.startService(
      notificationTitle: 'Market Checker Running',
      notificationText: 'Live Background Exchange Feeds & Alarms Active',
      callback: startCallback,
    );
  }

  static Future<void> stopService() async {
    await FlutterForegroundTask.stopService();
  }
}
