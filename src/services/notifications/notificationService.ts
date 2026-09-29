import { Alert, AlertTriggerLog, AppLanguage } from '../../types/crypto';
import { formatCurrencyPrice } from '../exchanges/symbolData';

class NotificationService {
  private permissionGranted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted';
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch (e) {
      return false;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public hasPermission(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  public sendSystemNotification(log: AlertTriggerLog, onClickCallback?: () => void) {
    if (!this.hasPermission()) return;

    try {
      const title = `Market Checker · ${log.symbol} (${log.exchange})`;
      const options: NotificationOptions = {
        body: `${log.title}\n${log.message}`,
        icon: '/favicon.ico',
        tag: `alert-${log.alertId}-${Date.now()}`,
        requireInteraction: false,
        silent: false,
      };

      const notif = new Notification(title, options);

      notif.onclick = () => {
        window.focus();
        if (onClickCallback) onClickCallback();
        notif.close();
      };
    } catch (e) {
      // Notification catch
    }
  }

  public formatAlertMessage(
    alert: Alert,
    currentPrice: number,
    lang: AppLanguage = 'en'
  ): { title: string; message: string; isUp: boolean } {
    const isUp = currentPrice >= alert.referencePrice;
    const quote = alert.quoteAsset || 'USDT';
    const fromStr = formatCurrencyPrice(alert.referencePrice, quote);
    const toStr = formatCurrencyPrice(currentPrice, quote);
    const targetStr = formatCurrencyPrice(alert.targetValue, quote);
    const changePct = (((currentPrice - alert.referencePrice) / (alert.referencePrice || 1)) * 100).toFixed(2);
    const absDiff = Math.abs(currentPrice - alert.referencePrice).toFixed(2);

    switch (lang) {
      case 'fa':
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} به قیمت هدف رسید 🎯`,
            message: `هدف: ${targetStr} · قیمت فعلی: ${toStr}`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} ${alert.targetValue}٪ ${isUp ? 'افزایش یافت ▲' : 'کاهش یافت ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else if (alert.type === 'trailingPeak') {
          return {
            title: `${alert.symbol} هشدار تغییر روند اوج/کف 🌊`,
            message: `${alert.targetValue}٪ جابجایی از سقف یا کف قیمت (${toStr})`,
            isUp,
          };
        } else if (alert.type === 'periodic') {
          return {
            title: `دیده‌بان دوره‌ای: ${alert.symbol}`,
            message: `قیمت کنونی: ${toStr} در ${alert.exchange}`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} تغییر قیمت به میزان ${targetStr} ${isUp ? '▲' : '▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : '-'}${absDiff})`,
            isUp,
          };
        }

      case 'zh':
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} 达到目标价格 🎯`,
            message: `目标 ${targetStr} · 当前 ${toStr}`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} 变动 ${alert.targetValue}% ${isUp ? '上涨 ▲' : '下跌 ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} 价格触发提醒`,
            message: `${fromStr} → ${toStr}`,
            isUp,
          };
        }

      case 'de':
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} Zielkurs erreicht 🎯`,
            message: `Ziel ${targetStr} ausgelöst (${toStr})`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} ${alert.targetValue}% ${isUp ? 'gestiegen ▲' : 'gefallen ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} Preisalarm`,
            message: `${fromStr} → ${toStr}`,
            isUp,
          };
        }

      case 'ku':
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} گەیشتە نرخی دیاریکراو 🎯`,
            message: `ئامانج: ${targetStr} · نرخی ئێستا: ${toStr}`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} ٪${alert.targetValue} ${isUp ? 'بەرزبووەوە ▲' : 'دابەزی ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} ئاگاداری نرخ`,
            message: `${fromStr} → ${toStr}`,
            isUp,
          };
        }

      case 'ar':
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} وصل إلى السعر المستهدف 🎯`,
            message: `الهدف ${targetStr} تحقق (${toStr})`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} تحرك بنسبة ${alert.targetValue}% ${isUp ? 'ارتفاعاً ▲' : 'هبوطاً ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} تنبيه سعر`,
            message: `${fromStr} → ${toStr}`,
            isUp,
          };
        }

      case 'fr':
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} Objectif de prix atteint 🎯`,
            message: `Cible ${targetStr} déclenchée (${toStr})`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} a varié de ${alert.targetValue}% ${isUp ? 'en hausse ▲' : 'en baisse ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} Alerte de prix`,
            message: `${fromStr} → ${toStr}`,
            isUp,
          };
        }

      case 'en':
      default:
        if (alert.type === 'priceTarget') {
          return {
            title: `${alert.symbol} reached target ${targetStr} 🎯`,
            message: `Target reached on ${alert.exchange} (${toStr})`,
            isUp,
          };
        } else if (alert.type === 'repeatingPercentage') {
          return {
            title: `${alert.symbol} moved ${alert.targetValue}% ${isUp ? 'Up ▲' : 'Down ▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : ''}${changePct}%)`,
            isUp,
          };
        } else if (alert.type === 'trailingPeak') {
          return {
            title: `${alert.symbol} Trailing Reversal Alert 🌊`,
            message: `${alert.targetValue}% shift from high/low threshold (${toStr})`,
            isUp,
          };
        } else if (alert.type === 'periodic') {
          return {
            title: `Market Checker: ${alert.symbol} (${alert.exchange})`,
            message: `Current Price: ${toStr}`,
            isUp,
          };
        } else {
          return {
            title: `${alert.symbol} shifted by ${targetStr} ${isUp ? '▲' : '▼'}`,
            message: `${fromStr} → ${toStr} (${isUp ? '+' : '-'}${absDiff})`,
            isUp,
          };
        }
    }
  }
}

export const notificationService = new NotificationService();
