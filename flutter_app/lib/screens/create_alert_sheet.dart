import 'package:flutter/material.dart';
import '../models/alert_model.dart';
import '../models/settings_model.dart';
import '../services/storage_service.dart';

class CreateAlertSheet extends StatefulWidget {
  final SettingsModel settings;
  final AlertModel? editAlert;
  final String? initialSymbol;
  final String? initialExchange;
  final VoidCallback onSaved;

  const CreateAlertSheet({
    Key? key,
    required this.settings,
    this.editAlert,
    this.initialSymbol,
    this.initialExchange,
    required this.onSaved,
  }) : super(key: key);

  @override
  State<CreateAlertSheet> createState() => _CreateAlertSheetState();
}

class _CreateAlertSheetState extends State<CreateAlertSheet> {
  late String _exchange;
  late String _symbol;
  late AlertType _type;
  late AlertDirection _direction;
  late TextEditingController _targetCtrl;
  late TextEditingController _refCtrl;
  late TextEditingController _noteCtrl;
  bool _isOneShot = false;
  bool _isTTSVoice = true;
  bool _isAlarmLoop = false;

  @override
  void initState() {
    super.initState();
    final a = widget.editAlert;
    _exchange = a?.exchange ?? widget.initialExchange ?? 'Binance';
    _symbol = a?.symbol ?? widget.initialSymbol ?? 'BTCUSDT';
    _type = a?.type ?? AlertType.repeatingPercentage;
    _direction = a?.direction ?? AlertDirection.both;
    _targetCtrl = TextEditingController(text: (a?.targetValue ?? 1.0).toString());
    _refCtrl = TextEditingController(text: (a?.referencePrice ?? 67200.0).toString());
    _noteCtrl = TextEditingController(text: a?.note ?? '');
    _isOneShot = a?.isOneShot ?? false;
    _isTTSVoice = a?.isTTSVoice ?? true;
    _isAlarmLoop = a?.isAlarmLoop ?? false;
  }

  void _save() {
    final target = double.tryParse(_targetCtrl.text) ?? 1.0;
    final ref = double.tryParse(_refCtrl.text) ?? 67200.0;

    final alerts = StorageService.getAlerts();
    if (widget.editAlert != null) {
      final idx = alerts.indexWhere((a) => a.id == widget.editAlert!.id);
      if (idx != -1) {
        alerts[idx] = AlertModel(
          id: widget.editAlert!.id,
          exchange: _exchange,
          symbol: _symbol,
          baseAsset: _symbol.replaceAll('USDT', ''),
          quoteAsset: 'USDT',
          type: _type,
          direction: _direction,
          targetValue: target,
          referencePrice: ref,
          isOneShot: _isOneShot,
          isTTSVoice: _isTTSVoice,
          isAlarmLoop: _isAlarmLoop,
          note: _noteCtrl.text,
        );
      }
    } else {
      alerts.insert(
        0,
        AlertModel(
          id: 'alert_${DateTime.now().millisecondsSinceEpoch}',
          exchange: _exchange,
          symbol: _symbol,
          baseAsset: _symbol.replaceAll('USDT', ''),
          quoteAsset: 'USDT',
          type: _type,
          direction: _direction,
          targetValue: target,
          referencePrice: ref,
          isOneShot: _isOneShot,
          isTTSVoice: _isTTSVoice,
          isAlarmLoop: _isAlarmLoop,
          note: _noteCtrl.text,
        ),
      );
    }

    StorageService.saveAlerts(alerts);
    widget.onSaved();
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isFa = widget.settings.language == 'fa';
    final isDark = widget.settings.theme == 'dark';
    final cardBg = isDark ? const Color(0xFF111726) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final borderColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);

    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  widget.editAlert != null
                      ? (isFa ? 'ویرایش هشدار' : 'Edit Alert')
                      : (isFa ? 'ایجاد هشدار هوشمند' : 'Create Smart Alert'),
                  style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 18),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Symbol & Exchange Row
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    initialValue: _symbol,
                    decoration: InputDecoration(
                      labelText: isFa ? 'نماد (Symbol)' : 'Symbol',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onChanged: (val) => _symbol = val.toUpperCase(),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _exchange,
                    decoration: InputDecoration(
                      labelText: isFa ? 'صرافی' : 'Exchange',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    items: ['Binance', 'Coinbase', 'Kraken', 'OKX', 'MEXC', 'OANDA', 'ICE', 'CBOE', 'NASDAQ']
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (val) => setState(() => _exchange = val ?? 'Binance'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Alert Type Selector
            DropdownButtonFormField<AlertType>(
              value: _type,
              decoration: InputDecoration(
                labelText: isFa ? 'نوع محاسبه هشدار' : 'Alert Engine Type',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              items: [
                DropdownMenuItem(
                  value: AlertType.repeatingPercentage,
                  child: Text(isFa ? 'تکرارشونده درصدی (Repeating %)' : 'Repeating Percentage (%)'),
                ),
                DropdownMenuItem(
                  value: AlertType.percentage,
                  child: Text(isFa ? 'درصدی یکباره (One-time %)' : 'One-time Percentage (%)'),
                ),
                DropdownMenuItem(
                  value: AlertType.absolutePrice,
                  child: Text(isFa ? 'رسیدن به قیمت دقیق (Absolute Target)' : 'Absolute Target Price (\$)'),
                ),
                DropdownMenuItem(
                  value: AlertType.stepValue,
                  child: Text(isFa ? 'پله‌های قیمتی (Step Interval)' : 'Step Value Interval'),
                ),
              ],
              onChanged: (val) => setState(() => _type = val ?? AlertType.repeatingPercentage),
            ),
            const SizedBox(height: 14),

            // Target Value & Reference Price
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _targetCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: InputDecoration(
                      labelText: _type == AlertType.absolutePrice
                          ? (isFa ? 'قیمت هدف (\$)' : 'Target Price (\$)')
                          : (isFa ? 'درصد تغییر (%)' : 'Percentage (%)'),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _refCtrl,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: InputDecoration(
                      labelText: isFa ? 'قیمت مبنا (Reference)' : 'Reference Price (\$)',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Native Toggles (TTS voice, loop, one-shot)
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(isFa ? 'گوینده صوتی هوشمند (TTS Voice)' : 'Voice TTS Announcer', style: TextStyle(color: textColor, fontSize: 13)),
              value: _isTTSVoice,
              activeColor: const Color(0xFF10B981),
              onChanged: (val) => setState(() => _isTTSVoice = val),
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(isFa ? 'حالت آژیر ممتد تا زمان بستن' : 'Continuous Alarm Siren', style: TextStyle(color: textColor, fontSize: 13)),
              value: _isAlarmLoop,
              activeColor: const Color(0xFFF59E0B),
              onChanged: (val) => setState(() => _isAlarmLoop = val),
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _save,
                child: Text(
                  isFa ? 'ذخیره و فعال‌سازی هشدار' : 'Save & Activate Alert',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
