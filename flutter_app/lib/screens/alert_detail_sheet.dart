import 'package:flutter/material.dart';
import '../models/alert_model.dart';
import '../models/settings_model.dart';
import '../services/storage_service.dart';

class AlertDetailSheet extends StatelessWidget {
  final AlertModel alert;
  final SettingsModel settings;
  final double currentPrice;
  final VoidCallback onUpdated;
  final VoidCallback onEdit;

  const AlertDetailSheet({
    Key? key,
    required this.alert,
    required this.settings,
    required this.currentPrice,
    required this.onUpdated,
    required this.onEdit,
  }) : super(key: key);

  void _resetReference(BuildContext context) {
    alert.referencePrice = currentPrice;
    alert.hasUnreadTrigger = false;
    final alerts = StorageService.getAlerts();
    final idx = alerts.indexWhere((a) => a.id == alert.id);
    if (idx != -1) {
      alerts[idx] = alert;
      StorageService.saveAlerts(alerts);
    }
    onUpdated();
    Navigator.pop(context);
  }

  void _deleteAlert(BuildContext context) {
    final alerts = StorageService.getAlerts();
    alerts.removeWhere((a) => a.id == alert.id);
    StorageService.saveAlerts(alerts);
    onUpdated();
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isFa = settings.language == 'fa';
    final isDark = settings.theme == 'dark';
    final cardBg = isDark ? const Color(0xFF111726) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    final diff = currentPrice - alert.referencePrice;
    final diffPct = alert.referencePrice > 0 ? (diff / alert.referencePrice) * 100 : 0.0;
    final isPositive = diffPct >= 0;

    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    alert.symbol,
                    style: TextStyle(
                      color: textColor,
                      fontWeight: FontWeight.w900,
                      fontSize: 22,
                      fontFamily: 'JetBrains Mono',
                    ),
                  ),
                  Text('${alert.exchange} · ${alert.type.name}', style: TextStyle(color: subColor, fontSize: 13)),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Price Metrics Container
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF090D16) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(isFa ? 'قیمت فعلی' : 'Current Price', style: TextStyle(color: subColor, fontSize: 11)),
                    Text(
                      '\$${currentPrice.toStringAsFixed(2)}',
                      style: TextStyle(
                        color: textColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        fontFamily: 'JetBrains Mono',
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(isFa ? 'قیمت مبنا' : 'Reference Price', style: TextStyle(color: subColor, fontSize: 11)),
                    Text(
                      '\$${alert.referencePrice.toStringAsFixed(2)}',
                      style: TextStyle(
                        color: textColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        fontFamily: 'JetBrains Mono',
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(isFa ? 'انحراف' : 'Deviation', style: TextStyle(color: subColor, fontSize: 11)),
                    Text(
                      '${isPositive ? '+' : ''}${diffPct.toStringAsFixed(2)}%',
                      style: TextStyle(
                        color: isPositive ? const Color(0xFF10B981) : const Color(0xFFE11D48),
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        fontFamily: 'JetBrains Mono',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.refresh, size: 16),
                  label: Text(isFa ? 'ریست مبنا به قیمت فعلی' : 'Reset Baseline'),
                  onPressed: () => _resetReference(context),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF59E0B),
                    foregroundColor: Colors.black,
                  ),
                  icon: const Icon(Icons.edit, size: 16),
                  label: Text(isFa ? 'ویرایش' : 'Edit'),
                  onPressed: onEdit,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: TextButton.icon(
              icon: const Icon(Icons.delete, color: Colors.red, size: 16),
              label: Text(isFa ? 'حذف هشدار' : 'Delete Alert', style: const TextStyle(color: Colors.red)),
              onPressed: () => _deleteAlert(context),
            ),
          ),
        ],
      ),
    );
  }
}
