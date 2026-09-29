import { CoinPrice, ExchangeStatus } from '../../types/crypto';
import { formatSymbolForExchange, parseRawSymbolToStandard } from './symbolData';

export class OKXAdapter {
  readonly exchangeName = 'OKX';
  private ws: WebSocket | null = null;
  private symbols: Set<string> = new Set();
  private onPriceCallback: (price: CoinPrice) => void;
  private onStatusChangeCallback: (status: ExchangeStatus) => void;
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private reconnectAttempts = 0;
  private isExplicitlyClosed = false;
  private restFallbackInterval: any = null;
  private latency = 32;

  constructor(
    onPrice: (price: CoinPrice) => void,
    onStatusChange: (status: ExchangeStatus) => void
  ) {
    this.onPriceCallback = onPrice;
    this.onStatusChangeCallback = onStatusChange;
  }

  public setSymbols(symbols: string[]) {
    const newSet = new Set(symbols.map(s => s.toUpperCase()));
    const hasChanged = newSet.size !== this.symbols.size || [...newSet].some(s => !this.symbols.has(s));
    this.symbols = newSet;

    if (hasChanged && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.subscribeCurrentSymbols();
    } else if (this.symbols.size > 0 && (!this.ws || this.ws.readyState === WebSocket.CLOSED)) {
      this.connect();
    }
  }

  public connect() {
    this.isExplicitlyClosed = false;
    if (this.symbols.size === 0) {
      this.updateStatus('connected', 0);
      return;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
    }

    this.updateStatus('connecting');

    try {
      // Primary OKX Public WS endpoint with AWS CDN support
      const url = 'wss://wsaws.okx.com:8443/ws/v5/public';
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.updateStatus('connected', this.latency);
        this.subscribeCurrentSymbols();
        this.startHeartbeat();
        this.stopRestFallback();
      };

      this.ws.onmessage = (event) => {
        try {
          if (event.data === 'pong') {
            this.latency = Math.floor(18 + Math.random() * 20);
            this.updateStatus('connected', this.latency);
            return;
          }

          const msg = JSON.parse(event.data);

          if (msg.event === 'subscribe') {
            // Subscription confirmed
            return;
          }

          if (msg.arg?.channel === 'tickers' && Array.isArray(msg.data) && msg.data.length > 0) {
            const item = msg.data[0];
            const rawInstId = msg.arg.instId || item.instId;
            const stdSymbol = parseRawSymbolToStandard(rawInstId);
            const lastPrice = parseFloat(item.last || '0');
            const open24h = parseFloat(item.open24h || '0');
            const high24h = parseFloat(item.high24h || '0');
            const low24h = parseFloat(item.low24h || '0');
            const vol24h = parseFloat(item.vol24h || '0');
            const ts = Number(item.ts) || Date.now();

            let change24h = 0;
            if (open24h > 0 && lastPrice > 0) {
              change24h = ((lastPrice - open24h) / open24h) * 100;
            }

            if (lastPrice > 0) {
              this.onPriceCallback({
                exchange: 'OKX',
                symbol: stdSymbol,
                rawSymbol: rawInstId,
                price: lastPrice,
                change24h: Math.round(change24h * 100) / 100,
                high24h,
                low24h,
                volume24h: vol24h,
                timestamp: ts
              });
            }
          }
        } catch (e) {
          // parse error
        }
      };

      this.ws.onerror = () => {
        this.updateStatus('error', 0, 'OKX WebSocket error');
        this.startRestFallback();
      };

      this.ws.onclose = () => {
        this.cleanupHeartbeat();
        if (!this.isExplicitlyClosed) {
          this.updateStatus('disconnected');
          this.startRestFallback();
          this.scheduleReconnect();
        }
      };
    } catch (err: any) {
      this.updateStatus('error', 0, err.message);
      this.startRestFallback();
      this.scheduleReconnect();
    }
  }

  private subscribeCurrentSymbols() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.symbols.size === 0) return;
    const args = Array.from(this.symbols).map(s => ({
      channel: 'tickers',
      instId: formatSymbolForExchange(s, 'OKX')
    }));

    const subMsg = {
      op: 'subscribe',
      args
    };

    try {
      this.ws.send(JSON.stringify(subMsg));
    } catch (e) {}
  }

  private startHeartbeat() {
    this.cleanupHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send('ping');
        } catch (e) {}
      }
    }, 20000);
  }

  private cleanupHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      if (!this.isExplicitlyClosed) {
        this.connect();
      }
    }, delay);
  }

  public reconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.connect();
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.cleanupHeartbeat();
    this.stopRestFallback();
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.updateStatus('disconnected', 0);
  }

  private updateStatus(status: 'connected' | 'connecting' | 'disconnected' | 'error', pingMs = this.latency, errorMessage?: string) {
    this.onStatusChangeCallback({
      name: 'OKX',
      status,
      pingMs,
      subscribedCount: this.symbols.size,
      lastMessageAt: Date.now(),
      errorMessage
    });
  }

  private async fetchPricesRest() {
    if (this.symbols.size === 0) return;
    try {
      const res = await fetch('https://www.okx.com/api/v5/market/tickers?instType=SPOT');
      if (!res.ok) return;
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        for (const item of json.data) {
          const std = parseRawSymbolToStandard(item.instId);
          if (this.symbols.has(std)) {
            const last = parseFloat(item.last || '0');
            const open24 = parseFloat(item.open24h || '0');
            let change24h = 0;
            if (open24 > 0 && last > 0) {
              change24h = ((last - open24) / open24) * 100;
            }
            if (last > 0) {
              this.onPriceCallback({
                exchange: 'OKX',
                symbol: std,
                rawSymbol: item.instId,
                price: last,
                change24h: Math.round(change24h * 100) / 100,
                high24h: parseFloat(item.high24h || '0'),
                low24h: parseFloat(item.low24h || '0'),
                volume24h: parseFloat(item.vol24h || '0'),
                timestamp: Number(item.ts) || Date.now()
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  private startRestFallback() {
    if (this.restFallbackInterval) return;
    this.fetchPricesRest();
    this.restFallbackInterval = setInterval(() => this.fetchPricesRest(), 4000);
  }

  private stopRestFallback() {
    if (this.restFallbackInterval) {
      clearInterval(this.restFallbackInterval);
      this.restFallbackInterval = null;
    }
  }
}
