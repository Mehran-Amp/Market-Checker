export interface ForegroundServiceState {
  isRunning: boolean;
  startTime: number;
  uptimeSeconds: number;
  wakeLockActive: boolean;
  silentAudioActive: boolean;
  channelName: string;
  notificationTitle: string;
  notificationBody: string;
}

class ForegroundServiceManager {
  private wakeLock: any = null;
  private timer: any = null;
  private silentAudio: HTMLAudioElement | null = null;
  private startTime: number = Date.now();
  private isRunning: boolean = true;
  private listeners: Set<(state: ForegroundServiceState) => void> = new Set();

  constructor() {
    this.startService();
  }

  public async startService() {
    this.isRunning = true;
    this.startTime = Date.now();
    await this.requestWakeLock();
    this.startTimer();
    this.notify();
  }

  public stopService() {
    this.isRunning = false;
    this.releaseWakeLock();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public async requestWakeLock(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
          this.notify();
        });
        this.notify();
        return true;
      }
    } catch (e) {
      // wake lock not supported or blocked
    }
    return false;
  }

  public releaseWakeLock() {
    if (this.wakeLock) {
      try {
        this.wakeLock.release();
      } catch (e) {}
      this.wakeLock = null;
    }
  }

  private startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isRunning) {
        this.notify();
      }
    }, 1000);
  }

  public getState(): ForegroundServiceState {
    const now = Date.now();
    const uptime = this.isRunning ? Math.floor((now - this.startTime) / 1000) : 0;
    return {
      isRunning: this.isRunning,
      startTime: this.startTime,
      uptimeSeconds: uptime,
      wakeLockActive: !!this.wakeLock,
      silentAudioActive: !!this.silentAudio,
      channelName: 'crypto_foreground_service_channel',
      notificationTitle: 'CryptoAlert Background Monitor Active',
      notificationBody: `Monitoring Binance, OKX & MEXC • Uptime ${Math.floor(uptime / 60)}m ${uptime % 60}s`
    };
  }

  public onStateChange(listener: (state: ForegroundServiceState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(l => l(state));
  }
}

export const foregroundService = new ForegroundServiceManager();
