import 'package:flutter/material.dart';
import '../models/alert_model.dart';
import '../models/coin_price_model.dart';
import '../models/settings_model.dart';
import '../services/storage_service.dart';
import '../services/exchange_manager.dart';
import 'create_alert_sheet.dart';
import 'alert_detail_sheet.dart';
import 'multi_market_screen.dart';
import 'settings_screen.dart';

class WatchlistScreen extends StatefulWidget {
  final SettingsModel settings;
  final VoidCallback onThemeToggle;

  const WatchlistScreen({
    Key? key,
    required this.settings,
    required this.onThemeToggle,
  }) : super(key: key);

  @override
  State<WatchlistScreen> createState() => _WatchlistScreenState();
}

class _WatchlistScreenState extends State<WatchlistScreen> {
  int _selectedTab = 0; // 0: Alerts, 1: Global Markets
  List<AlertModel> _alerts = [];
  Map<String, CoinPriceModel> _prices = {};
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadAlerts();
    ExchangeManager().addListener(_onPriceUpdate);
  }

  @override
  void dispose() {
    ExchangeManager().removeListener(_onPriceUpdate);
    super.dispose();
  }

  void _loadAlerts() {
    setState(() {
      _alerts = StorageService.getAlerts();
      _prices = ExchangeManager().latestPrices;
    });
  }

  void _onPriceUpdate(CoinPriceModel price) {
    if (mounted) {
      setState(() {
        _prices['${price.exchange}_${price.symbol}'] = price;
      });
    }
  }

  void _toggleAlert(AlertModel alert) {
    setState(() {
      alert.isActive = !alert.isActive;
    });
    StorageService.saveAlerts(_alerts);
  }

  void _openCreateSheet({AlertModel? editAlert, String? initialSymbol, String? initialExchange}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CreateAlertSheet(
        settings: widget.settings,
        editAlert: editAlert,
        initialSymbol: initialSymbol,
        initialExchange: initialExchange,
        onSaved: () => _loadAlerts(),
      ),
    );
  }

  void _openDetailSheet(AlertModel alert) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AlertDetailSheet(
        alert: alert,
        settings: widget.settings,
        currentPrice: _prices['${alert.exchange}_${alert.symbol}']?.price ?? alert.referencePrice,
        onUpdated: () => _loadAlerts(),
        onEdit: () {
          Navigator.pop(ctx);
          _openCreateSheet(editAlert: alert);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isFa = widget.settings.language == 'fa';
    final isDark = widget.settings.theme == 'dark';
    final bgColor = isDark ? const Color(0xFF090D16) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF111726) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);

    final filteredAlerts = _alerts.where((a) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return a.symbol.toLowerCase().contains(q) || a.exchange.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: isDark ? const Color(0xFF090D16) : Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF59E0B), Color(0xFFEA580C)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.radar, color: Colors.black, size: 20),
            ),
            const SizedBox(width: 8),
            Text(
              'Market Checker',
              style: TextStyle(
                color: textColor,
                fontWeight: FontWeight.w900,
                fontFamily: 'JetBrains Mono',
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode, color: subColor),
            onPressed: widget.onThemeToggle,
          ),
          IconButton(
            icon: Icon(Icons.settings, color: subColor),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (ctx) => SettingsScreen(
                    settings: widget.settings,
                    onSettingsChanged: () => setState(() {}),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Ongoing Ticker Banner
          if (widget.settings.ongoingNotificationEnabled)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFF10B981),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${widget.settings.ongoingSymbol} (${widget.settings.ongoingExchange})',
                        style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ],
                  ),
                  Text(
                    '\$${(_prices['${widget.settings.ongoingExchange}_${widget.settings.ongoingSymbol}']?.price ?? 67200).toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: Color(0xFFF59E0B),
                      fontWeight: FontWeight.w900,
                      fontFamily: 'JetBrains Mono',
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

          // Primary Segmented Tab (My Alerts vs Multi-Market Explore)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedTab = 0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: _selectedTab == 0 ? const Color(0xFFF59E0B) : cardBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: borderColor),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        isFa ? 'هشدارهای من (${_alerts.length})' : 'My Alerts (${_alerts.length})',
                        style: TextStyle(
                          color: _selectedTab == 0 ? Colors.black : textColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedTab = 1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: _selectedTab == 1 ? const Color(0xFF10B981) : cardBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: borderColor),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        isFa ? 'طلا، نفت، شاخص و سهام' : 'Forex, Gold & Indices',
                        style: TextStyle(
                          color: _selectedTab == 1 ? Colors.black : textColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: _selectedTab == 1
                ? MultiMarketScreen(
                    settings: widget.settings,
                    onQuickAlert: (ex, sym) => _openCreateSheet(initialExchange: ex, initialSymbol: sym),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredAlerts.length,
                    itemBuilder: (ctx, idx) {
                      final alert = filteredAlerts[idx];
                      final priceObj = _prices['${alert.exchange}_${alert.symbol}'];
                      final currentPrice = priceObj?.price ?? alert.referencePrice;
                      final diffPct = alert.referencePrice > 0
                          ? ((currentPrice - alert.referencePrice) / alert.referencePrice) * 100
                          : 0.0;
                      final isPositive = diffPct >= 0;

                      return GestureDetector(
                        onTap: () => _openDetailSheet(alert),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: alert.hasUnreadTrigger
                                  ? const Color(0xFFF59E0B)
                                  : borderColor,
                              width: alert.hasUnreadTrigger ? 1.5 : 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF59E0B).withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          alert.exchange,
                                          style: const TextStyle(
                                            color: Color(0xFFF59E0B),
                                            fontWeight: FontWeight.bold,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        alert.symbol,
                                        style: TextStyle(
                                          color: textColor,
                                          fontWeight: FontWeight.w900,
                                          fontSize: 16,
                                          fontFamily: 'JetBrains Mono',
                                        ),
                                      ),
                                    ],
                                  ),
                                  Switch(
                                    value: alert.isActive,
                                    activeColor: const Color(0xFF10B981),
                                    onChanged: (val) => _toggleAlert(alert),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '\$${currentPrice.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      color: textColor,
                                      fontWeight: FontWeight.w900,
                                      fontSize: 20,
                                      fontFamily: 'JetBrains Mono',
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: (isPositive ? const Color(0xFF10B981) : const Color(0xFFE11D48))
                                          .withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '${isPositive ? '+' : ''}${diffPct.toStringAsFixed(2)}%',
                                      style: TextStyle(
                                        color: isPositive ? const Color(0xFF10B981) : const Color(0xFFE11D48),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                        fontFamily: 'JetBrains Mono',
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFF59E0B),
        foregroundColor: Colors.black,
        icon: const Icon(Icons.add_alert, size: 20),
        label: Text(
          isFa ? 'هشدار جدید' : 'New Alert',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        onPressed: () => _openCreateSheet(),
      ),
    );
  }
}
