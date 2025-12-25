
// Audio service for handling laboratory sound effects using Web Audio API
class AudioService {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  // Renamed from createGain to avoid collision with standard AudioContext.createGain()
  private createGainEnvelope(startTime: number, duration: number, startValue: number, endValue: number) {
    const ctx = this.getContext();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(startValue, startTime);
    gain.gain.exponentialRampToValueAtTime(endValue, startTime + duration);
    return gain;
  }

  playTick() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    // Using the renamed envelope helper
    const gain = this.createGainEnvelope(now, 0.05, 0.1, 0.001);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playBlip() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    // Using the renamed envelope helper
    const gain = this.createGainEnvelope(now, 0.1, 0.2, 0.001);

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playDelete() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    // Using the renamed envelope helper
    const gain = this.createGainEnvelope(now, 0.2, 0.1, 0.001);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playSynthesized() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    // Low hum rising
    const osc1 = ctx.createOscillator();
    // Using the renamed envelope helper
    const gain1 = this.createGainEnvelope(now, 0.8, 0.001, 0.1);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(100, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // High chime
    const osc2 = ctx.createOscillator();
    // Using the renamed envelope helper to fix the error on line 87 (or adjacent)
    const gain2 = this.createGainEnvelope(now + 0.8, 0.5, 0.2, 0.001);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, now + 0.8);
    osc2.frequency.exponentialRampToValueAtTime(600, now + 1.3);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.8);
    osc2.start(now + 0.8);
    osc2.stop(now + 1.3);
  }
}

export const audioService = new AudioService();
