import { AppLanguage, CustomSoundItem, SoundTone, VibrationPatternType } from '../../types/crypto';

const CUSTOM_SOUNDS_KEY = 'crypto_custom_sounds_hive';

class AudioService {
  private ctx: AudioContext | null = null;
  private activeAudioElement: HTMLAudioElement | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // --- Custom Audio Storage & Management ---
  public getCustomSounds(): CustomSoundItem[] {
    try {
      const raw = localStorage.getItem(CUSTOM_SOUNDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  public saveCustomSound(name: string, dataUrl: string): CustomSoundItem {
    const list = this.getCustomSounds();
    const newItem: CustomSoundItem = {
      id: `custom-sound-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.slice(0, 40),
      dataUrl,
      createdAt: Date.now(),
    };
    list.unshift(newItem);
    // Limit to 10 stored custom sounds to prevent localstorage quota overflow
    if (list.length > 10) list.pop();
    localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(list));
    return newItem;
  }

  public deleteCustomSound(id: string) {
    const list = this.getCustomSounds().filter((s) => s.id !== id);
    localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(list));
  }

  public playCustomAudio(dataUrl: string, volume: number = 0.8): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (this.activeAudioElement) {
          this.activeAudioElement.pause();
          this.activeAudioElement = null;
        }
        const audio = new Audio(dataUrl);
        audio.volume = Math.min(Math.max(volume, 0.05), 1.0);
        this.activeAudioElement = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      } catch (e) {
        resolve();
      }
    });
  }

  /**
   * Plays alert sound customized by tone or custom uploaded ringtone:
   */
  public playAlertSound(
    isUp: boolean = true,
    isTarget: boolean = false,
    volume: number = 0.8,
    tone: SoundTone = 'crystal',
    customSoundId?: string
  ) {
    try {
      // Check if tone is custom or customSoundId is provided
      if ((tone === 'custom' || customSoundId) && typeof window !== 'undefined') {
        const customList = this.getCustomSounds();
        const found = customList.find((s) => s.id === customSoundId) || customList[0];
        if (found && found.dataUrl) {
          this.playCustomAudio(found.dataUrl, volume);
          return;
        }
      }

      const ctx = this.getAudioContext();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      const vol = Math.min(Math.max(volume, 0.05), 1.0);
      masterGain.gain.setValueAtTime(vol, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (tone) {
        case 'classic': {
          // Iconic BitcoinChecker 8-bit retro arpeggio
          const notes = isUp ? [523.25, 659.25, 783.99, 1046.5] : [1046.5, 783.99, 659.25, 523.25];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.18, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.075);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.08);
          });
          break;
        }

        case 'radar': {
          // Double sonar ping
          [880, 1760].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);

            gain.gain.setValueAtTime(0, now + idx * 0.12);
            gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.12 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.26);
          });
          break;
        }

        case 'chime': {
          // Soft harmonic glass chime
          [523.25, 783.99, 1046.5, 1318.51].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.07 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.52);
          });
          break;
        }

        case 'arcade': {
          // Arcade jump coin sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(987.77, now);
          osc.frequency.setValueAtTime(1318.51, now + 0.08);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.36);
          break;
        }

        case 'emergency':
        case 'siren': {
          // High priority warble alarm
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(isUp ? 880 : 660, now);
          osc.frequency.linearRampToValueAtTime(isUp ? 1320 : 440, now + 0.18);
          osc.frequency.linearRampToValueAtTime(isUp ? 880 : 660, now + 0.36);

          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case 'cyber': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(isUp ? 440 : 880, now);
          osc.frequency.exponentialRampToValueAtTime(isUp ? 1200 : 300, now + 0.25);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case 'bell': {
          const freqs = [659.25, 1318.5];
          freqs.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 0.6);
          });
          break;
        }

        case 'ping': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isUp ? 1046.5 : 880, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'crystal':
        default: {
          const freqs = isTarget
            ? isUp
              ? [587.33, 739.99, 880.0, 1174.66]
              : [880.0, 739.99, 587.33, 440.0]
            : isUp
            ? [659.25, 880.0]
            : [587.33, 440.0];

          freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.4);
          });
          break;
        }
      }
    } catch (e) {
      // Audio safety catch
    }
  }

  public playTestTone(volume: number = 0.8, tone: SoundTone = 'crystal', customSoundId?: string) {
    this.playAlertSound(true, false, volume, tone, customSoundId);
  }

  public speakAlert(text: string, lang: AppLanguage = 'en') {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap: Record<AppLanguage, string> = {
          en: 'en-US',
          zh: 'zh-CN',
          de: 'de-DE',
          ku: 'ku',
          ar: 'ar-SA',
          fr: 'fr-FR',
          fa: 'fa-IR',
        };
        utterance.lang = langMap[lang] || 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      // TTS catch
    }
  }

  public triggerVibration(patternType: VibrationPatternType = 'double') {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        switch (patternType) {
          case 'single':
            navigator.vibrate(200);
            break;
          case 'double':
            navigator.vibrate([150, 100, 150]);
            break;
          case 'long':
            navigator.vibrate(600);
            break;
          case 'sos':
            navigator.vibrate([100, 80, 100, 80, 100, 200, 300, 80, 300, 80, 300, 200, 100, 80, 100, 80, 100]);
            break;
        }
      }
    } catch (e) {}
  }
}

export const audioService = new AudioService();
