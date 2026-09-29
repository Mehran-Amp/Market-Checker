import 'package:flutter/material.dart';
import '../models/market_asset_model.dart';
import '../models/settings_model.dart';
import '../services/multi_market_service.dart';

class MultiMarketScreen extends StatefulWidget {
  final SettingsModel settings;
  final Function(String exchange, String symbol) onQuickAlert;

  const MultiMarketScreen({
    Key? key,
    required this.settings,
    required this.onQuickAlert,
  }) : super(key: key);

  @override
  State<MultiMarketScreen> createState() => _MultiMarketScreenState();
}

class _MultiMarketScreenState extends State<MultiMarketScreen> {
  MarketType? _selectedCategory;
  String _search = '';
  late List<MarketAssetModel> _assets;

  @override
  void initState() {
    super.initState();
    _assets = MultiMarketService.getGlobalAssets();
  }

  @override
  Widget build(BuildContext context) {
    final isFa = widget.settings.language == 'fa';
    final isDark = widget.settings.theme == 'dark';
    final cardBg = isDark ? const Color(0xFF111726) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);

    final filtered = _assets.where((a) {
      if (_selectedCategory != null && a.market != _selectedCategory) {
        return false;
      }
      if (_search.isNotEmpty) {
        final q = _search.toLowerCase();
        return a.symbol.toLowerCase().contains(q) ||
            a.name.toLowerCase().contains(q) ||
            a.faName.toLowerCase().contains(q);
      }
      return true;
    }).toList();

    return Column(
      children: [
        // Category Pills Filter
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              _buildFilterChip('همه بازارها', 'All Markets', null, isFa, isDark),
              _buildFilterChip('طلا و فلزات', 'Metals', MarketType.metals, isFa, isDark),
              _buildFilterChip('نفت و انرژی', 'Energy', MarketType.energy, isFa, isDark),
              _buildFilterChip('فارکس', 'Forex', MarketType.forex, isFa, isDark),
              _buildFilterChip('شاخص‌های بورس', 'Indices', MarketType.indices, isFa, isDark),
              _buildFilterChip('اوراق قرضه', 'Bonds', MarketType.bonds, isFa, isDark),
              _buildFilterChip('سهام آمریکا', 'Stocks', MarketType.stocks, isFa, isDark),
            ],
          ),
        ),

        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: filtered.length,
            itemBuilder: (ctx, idx) {
              final asset = filtered[idx];
              final isPositive = asset.change24h >= 0;

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              asset.symbol,
                              style: TextStyle(
                                color: textColor,
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                                fontFamily: 'JetBrains Mono',
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF6366F1).withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                isFa ? asset.faCategoryName : asset.categoryName,
                                style: const TextStyle(
                                  color: Color(0xFF6366F1),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          isFa ? asset.faName : asset.name,
                          style: TextStyle(color: subColor, fontSize: 12),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          asset.quoteAsset == '%'
                              ? '${asset.price.toStringAsFixed(2)}%'
                              : '\$${asset.price.toStringAsFixed(2)}',
                          style: TextStyle(
                            color: textColor,
                            fontWeight: FontWeight.w900,
                            fontSize: 16,
                            fontFamily: 'JetBrains Mono',
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              '${isPositive ? '+' : ''}${asset.change24h.toStringAsFixed(2)}%',
                              style: TextStyle(
                                color: isPositive ? const Color(0xFF10B981) : const Color(0xFFE11D48),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                                fontFamily: 'JetBrains Mono',
                              ),
                            ),
                            const SizedBox(width: 8),
                            InkWell(
                              onTap: () => widget.onQuickAlert(asset.exchange, asset.symbol),
                              child: Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF59E0B).withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Icon(Icons.add_alert, color: Color(0xFFF59E0B), size: 16),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFilterChip(String fa, String en, MarketType? type, bool isFa, bool isDark) {
    final isSelected = _selectedCategory == type;
    return GestureDetector(
      onTap: () => setState(() => _selectedCategory = type),
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFF59E0B)
              : (isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          isFa ? fa : en,
          style: TextStyle(
            color: isSelected ? Colors.black : (isDark ? Colors.white : Colors.black87),
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}
