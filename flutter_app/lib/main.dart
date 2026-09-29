import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'models/settings_model.dart';
import 'services/storage_service.dart';
import 'services/foreground_service.dart';
import 'services/exchange_manager.dart';
import 'screens/watchlist_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  await ForegroundServiceManager.init();
  ExchangeManager().start();

  final settings = StorageService.getSettings();
  if (settings.persistentServiceEnabled) {
    await ForegroundServiceManager.startService();
  }

  runApp(const MarketCheckerApp());
}

class MarketCheckerApp extends StatefulWidget {
  const MarketCheckerApp({Key? key}) : super(key: key);

  @override
  State<MarketCheckerApp> createState() => _MarketCheckerAppState();
}

class _MarketCheckerAppState extends State<MarketCheckerApp> {
  late SettingsModel _settings;

  @override
  void initState() {
    super.initState();
    _settings = StorageService.getSettings();
  }

  void _toggleTheme() {
    setState(() {
      final newTheme = _settings.theme == 'dark' ? 'light' : 'dark';
      _settings = SettingsModel.fromMap({..._settings.toMap(), 'theme': newTheme});
      StorageService.saveSettings(_settings);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isFa = _settings.language == 'fa';
    final isDark = _settings.theme == 'dark';

    return MaterialApp(
      title: 'Market Checker',
      debugShowCheckedModeBanner: false,
      locale: Locale(_settings.language),
      supportedLocales: const [
        Locale('fa', 'IR'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        brightness: isDark ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor: isDark ? const Color(0xFF090D16) : const Color(0xFFF8FAFC),
        primaryColor: const Color(0xFFF59E0B),
        fontFamily: isFa ? 'Vazirmatn' : GoogleFonts.plusJakartaSans().fontFamily,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFF59E0B),
          brightness: isDark ? Brightness.dark : Brightness.light,
          primary: const Color(0xFFF59E0B),
        ),
      ),
      home: Directionality(
        textDirection: isFa ? TextDirection.rtl : TextDirection.ltr,
        child: WatchlistScreen(
          settings: _settings,
          onThemeToggle: _toggleTheme,
        ),
      ),
    );
  }
}
