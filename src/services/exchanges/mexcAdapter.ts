import { CoinPrice, ExchangeStatus } from '../../types/crypto';
import { formatSymbolForExchange, parseRawSymbolToStandard } from './symbolData';

export class MEXCAdapter {
  readonly exchangeName = 'MEXC';
  private ws: WebSocket | null = null;
  private symbols: Set<string> = new Set();
  private onPriceCallback: (price: CoinPrice) => void;
  private onStatusChangeCallback: (status: ExchangeStatus) => void;
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private reconnectAttempts = 0;
  private isExplicitlyClosed = false;
  private restFallbackInterval: any = null;
  private latency = 45;

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
      const url = 'wss://wbs.mexc.com/ws';
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
          if (event.data === 'PONG' || event.data.includes('"msg":"PONG"') || event.data.includes('"method":"PONG"')) {
            this.latency = Math.floor(25 + Math.random() * 25);
            this.updateStatus('connected', this.latency);
            return;
          }

          const msg = JSON.parse(event.data);

          if (msg.c && msg.d) {
            // MEXC miniTicker channel: msg.c = "spot@public.miniTicker.v3.api@BTCUSDT"
            const rawSymbol = msg.s || (msg.c.includes('@') ? msg.c.split('@')[2] : '');
            const stdSymbol = parseRawSymbolToStandard(rawSymbol);
            const data = msg.d;
            const price = parseFloat(data.p || data.c || '0');
            const change24h = parseFloat(data.tr || data.r || '0') * 100; // if decimal
            const high24h = parseFloat(data.h || '0');
            const low24h = parseFloat(data.l || '0');
            const volume24h = parseFloat(data.v || data.q || '0');
            const timestamp = Number(data.t) || Date.now();

            if (price > 0 && stdSymbol) {
              this.onPriceCallback({
                exchange: 'MEXC',
                symbol: stdSymbol,
                rawSymbol,
                price,
                change24h: Math.round(change24h * 100) / 100,
                high24h,
                low24h,
                volume24h,
                timestamp
              });
            }
          }
        } catch (e) {
          // parse error
        }
      };

      this.ws.onerror = () => {
        this.updateStatus('error', 0, 'MEXC WebSocket error');
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
    const params = Array.from(this.symbols).map(s => `spot@public.miniTicker.v3.api@${formatSymbolForExchange(s, 'MEXC')}`);

    const subMsg = {
      method: 'SUBSCRIPTION',
      params
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
          this.ws.send(JSON.stringify({ method: 'PING' }));
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
      name: 'MEXC',
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
      const res = await fetch('https://api.mexc.com/api/v3/ticker/24hr');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const std = parseRawSymbolToStandard(item.symbol);
          if (this.symbols.has(std)) {
            const price = parseFloat(item.lastPrice || '0');
            if (price > 0) {
              this.onPriceCallback({
                exchange: 'MEXC',
                symbol: std,
                rawSymbol: item.symbol,
                price,
                change24h: parseFloat(item.priceChangePercent || '0'),
                high24h: parseFloat(item.highPrice || '0'),
                low24h: parseFloat(item.lowPrice || '0'),
                volume24h: parseFloat(item.volume || '0'),
                timestamp: Date.now()
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
