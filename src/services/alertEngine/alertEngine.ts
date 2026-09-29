import { Alert, AlertDirection, AlertTriggerLog, CoinPrice, ExchangeName, AppSettings } from '../../types/crypto';
import { AlertStorage } from './alertStorage';
import { ExchangeManager } from '../exchanges/exchangeManager';
import { notificationService } from '../notifications/notificationService';
import { audioService } from '../notifications/audioService';
import confetti from 'canvas-confetti';

export type AlertEventListener = (event: {
  type: 'trigger' | 'update' | 'add' | 'delete';
  alert?: Alert;
  log?: AlertTriggerLog;
}) => void;

export class AlertEngine {
  private static instance: AlertEngine | null = null;
  private exchangeManager: ExchangeManager;
  private listeners: Set<AlertEventListener> = new Set();
  private recentTriggerDebounce: Map<string, number> = new Map(); // prevent double triggers within 2500ms

  private constructor() {
    this.exchangeManager = ExchangeManager.getInstance();

    // Listen to all real-time price ticks from all exchanges
    this.exchangeManager.onPrice((price) => {
      this.evaluatePriceTick(price);
    });

    // Synchronize initial active subscriptions
    this.syncExchangeSubscriptions();
  }

  public static getInstance(): AlertEngine {
    if (!AlertEngine.instance) {
      AlertEngine.instance = new AlertEngine();
    }
    return AlertEngine.instance;
  }

  public syncExchangeSubscriptions() {
    const alerts = AlertStorage.getAllAlerts();
    const settings = AlertStorage.getSettings();

    const exchangeSymbols: Partial<Record<ExchangeName, Set<string>>> = {};

    alerts.forEach((alert) => {
      if (alert.isActive) {
        if (!exchangeSymbols[alert.exchange]) {
          exchangeSymbols[alert.exchange] = new Set();
        }
        exchangeSymbols[alert.exchange]!.add(alert.symbol);
      }
    });

    // Ensure ongoing notification symbol is also subscribed
    if (settings.ongoingSymbol && settings.ongoingExchange) {
      if (!exchangeSymbols[settings.ongoingExchange]) {
        exchangeSymbols[settings.ongoingExchange] = new Set();
      }
      exchangeSymbols[settings.ongoingExchange]!.add(settings.ongoingSymbol);
    }

    // Subscribe all sets to exchangeManager
    Object.entries(exchangeSymbols).forEach(([ex, symSet]) => {
      this.exchangeManager.subscribe(ex as ExchangeName, Array.from(symSet));
    });

    // Make sure Binance has at least BTCUSDT for benchmark
    this.exchangeManager.subscribe('Binance', ['BTCUSDT']);
  }

  /**
   * Pure evaluation logic conforming to the specification + BitcoinChecker Trailing Peak feature
   */
  public shouldTrigger(alert: Alert, price: CoinPrice): boolean {
    if (!alert.isActive) return false;
    const currentPrice = price.price;

    switch (alert.type) {
      case 'priceTarget':
        if (alert.direction === 'upOnly') {
          return currentPrice >= alert.targetValue;
        } else if (alert.direction === 'downOnly') {
          return currentPrice <= alert.targetValue;
        } else {
          return alert.targetValue >= alert.referencePrice 
            ? currentPrice >= alert.targetValue 
            : currentPrice <= alert.targetValue;
        }

      case 'repeatingPercentage': {
        const changePct = ((currentPrice - alert.referencePrice) / alert.referencePrice) * 100;
        if (alert.direction === 'upOnly') {
          return changePct >= alert.targetValue;
        } else if (alert.direction === 'downOnly') {
          return changePct <= -alert.targetValue;
        } else {
          return Math.abs(changePct) >= alert.targetValue;
        }
      }

      case 'repeatingAbsolute': {
        const change = currentPrice - alert.referencePrice;
        if (alert.direction === 'upOnly') {
          return change >= alert.targetValue;
        } else if (alert.direction === 'downOnly') {
          return change <= -alert.targetValue;
        } else {
          return Math.abs(change) >= alert.targetValue;
        }
      }

      // BitcoinChecker Inspired: Trailing Peak / Drop from 24h High or bounce from 24h Low
      case 'trailingPeak': {
        const high = price.high24h || currentPrice;
        const low = price.low24h || currentPrice;

        const dropFromHighPct = high > 0 ? ((high - currentPrice) / high) * 100 : 0;
        const riseFromLowPct = low > 0 ? ((currentPrice - low) / low) * 100 : 0;

        if (alert.direction === 'downOnly') {
          return dropFromHighPct >= alert.targetValue;
        } else if (alert.direction === 'upOnly') {
          return riseFromLowPct >= alert.targetValue;
        } else {
          return dropFromHighPct >= alert.targetValue || riseFromLowPct >= alert.targetValue;
        }
      }

      default:
        return false;
    }
    return false;
  }

  private evaluatePriceTick(price: CoinPrice) {
    const allAlerts = AlertStorage.getAllAlerts();
    const matchingAlerts = allAlerts.filter(
      a => a.isActive && a.exchange === price.exchange && a.symbol.toUpperCase() === price.symbol.toUpperCase()
    );

    for (const alert of matchingAlerts) {
      if (this.shouldTrigger(alert, price)) {
        // Debounce protection (2.5 seconds per alert)
        const lastTrig = this.recentTriggerDebounce.get(alert.id) || 0;
        if (Date.now() - lastTrig < 2500) continue;
        this.recentTriggerDebounce.set(alert.id, Date.now());

        this.handleTrigger(alert, price.price);
      }
    }
  }

  public handleTrigger(alert: Alert, currentPrice: number) {
    const settings: AppSettings = AlertStorage.getSettings();
    const oldRefPrice = alert.referencePrice;
    const isUp = currentPrice >= oldRefPrice;
    const changeAmt = currentPrice - oldRefPrice;
    const changePct = ((changeAmt) / (oldRefPrice || 1)) * 100;

    const msgInfo = notificationService.formatAlertMessage(alert, currentPrice, settings.language);

    // Create Log Record
    const log: AlertTriggerLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      alertId: alert.id,
      symbol: alert.symbol,
      exchange: alert.exchange,
      timestamp: Date.now(),
      type: alert.type,
      direction: alert.direction,
      fromPrice: oldRefPrice,
      toPrice: currentPrice,
      targetValue: alert.targetValue,
      changeAmount: Math.round(changeAmt * 100) / 100,
      changePercentage: Math.round(changePct * 100) / 100,
      title: msgInfo.title,
      message: msgInfo.message,
      read: false
    };

    AlertStorage.addLog(log);

    // Post-trigger state updates:
    // - priceTarget: isActive = false (one-time)
    // - repeatingPercentage / repeatingAbsolute / trailingPeak: referencePrice = currentPrice
    const updatedAlert: Alert = {
      ...alert,
      hasUnreadTrigger: true,
      lastTriggeredAt: Date.now(),
      lastTriggerPrice: currentPrice,
      triggerCount: (alert.triggerCount || 0) + 1,
      isActive: alert.type === 'priceTarget' ? false : alert.isActive,
      referencePrice: alert.type === 'priceTarget' ? alert.referencePrice : currentPrice
    };

    AlertStorage.updateAlert(updatedAlert);

    // Play Audio / Voice / Vibrate (BitcoinChecker options)
    if (settings.soundEnabled) {
      const tone = alert.soundToneOverride || settings.soundTone || 'classic';
      audioService.playAlertSound(isUp, alert.type === 'priceTarget', settings.soundVolume, tone);
    }
    if (settings.voiceAlerts || alert.voiceAlertOverride) {
      audioService.speakAlert(msgInfo.title, settings.language);
    }
    if (settings.vibration) {
      audioService.triggerVibration(settings.vibrationPattern || 'double');
    }

    // Fire Confetti on Target hits!
    if (alert.type === 'priceTarget') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    // Send native system browser notification
    if (settings.notificationsEnabled) {
      notificationService.sendSystemNotification(log);
    }

    // Broadcast event to UI
    this.notifyListeners({
      type: 'trigger',
      alert: updatedAlert,
      log
    });

    if (alert.type === 'priceTarget') {
      this.syncExchangeSubscriptions();
    }
  }

  // --- Manual Actions from UI ---
  public addAlert(alert: Alert) {
    AlertStorage.addAlert(alert);
    this.syncExchangeSubscriptions();
    this.notifyListeners({ type: 'add', alert });
  }

  public updateAlert(alert: Alert) {
    AlertStorage.updateAlert(alert);
    this.syncExchangeSubscriptions();
    this.notifyListeners({ type: 'update', alert });
  }

  public deleteAlert(id: string) {
    const alert = AlertStorage.getAlert(id);
    AlertStorage.deleteAlert(id);
    this.syncExchangeSubscriptions();
    this.notifyListeners({ type: 'delete', alert });
  }

  public cloneAlert(id: string) {
    const original = AlertStorage.getAlert(id);
    if (!original) return;
    const cloned: Alert = {
      ...original,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      triggerCount: 0,
      lastTriggeredAt: undefined,
      lastTriggerPrice: undefined,
      hasUnreadTrigger: false,
      customNote: original.customNote ? `${original.customNote} (Copy)` : undefined,
    };
    this.addAlert(cloned);
  }

  public toggleAlertActive(id: string) {
    const alert = AlertStorage.getAlert(id);
    if (alert) {
      const updated = { ...alert, isActive: !alert.isActive };
      AlertStorage.updateAlert(updated);
      this.syncExchangeSubscriptions();
      this.notifyListeners({ type: 'update', alert: updated });
    }
  }

  public resetReferencePrice(id: string, currentPrice?: number) {
    const alert = AlertStorage.getAlert(id);
    if (alert) {
      const price = currentPrice || this.exchangeManager.getPrice(alert.exchange, alert.symbol)?.price || alert.referencePrice;
      const updated = {
        ...alert,
        referencePrice: price,
        hasUnreadTrigger: false
      };
      AlertStorage.updateAlert(updated);
      this.notifyListeners({ type: 'update', alert: updated });
    }
  }

  public testTrigger(id: string) {
    const alert = AlertStorage.getAlert(id);
    if (!alert) return;
    const currentPrice = this.exchangeManager.getPrice(alert.exchange, alert.symbol)?.price || alert.referencePrice;
    const testDelta = alert.type === 'repeatingPercentage' ? (alert.referencePrice * (alert.targetValue / 100)) : (alert.type === 'repeatingAbsolute' ? alert.targetValue : 50);
    const simulatedPrice = alert.direction === 'downOnly' ? (currentPrice - (testDelta || 100)) : (currentPrice + (testDelta || 100));
    this.handleTrigger(alert, simulatedPrice);
  }

  public onEvent(listener: AlertEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(event: { type: 'trigger' | 'update' | 'add' | 'delete'; alert?: Alert; log?: AlertTriggerLog }) {
    this.listeners.forEach(l => l(event));
  }
}
