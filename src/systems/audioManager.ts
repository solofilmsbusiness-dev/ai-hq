export type SoundType = 'taskCreated' | 'taskStarted' | 'taskCompleted' | 'agentActive'

interface SoundConfig {
  type: SoundType
  duration: number // ms
  frequencies: number[]
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  taskCreated: {
    type: 'taskCreated',
    duration: 200,
    frequencies: [800, 1200],
  },
  taskStarted: {
    type: 'taskStarted',
    duration: 150,
    frequencies: [600, 900],
  },
  taskCompleted: {
    type: 'taskCompleted',
    duration: 300,
    frequencies: [1000, 1400, 1800],
  },
  agentActive: {
    type: 'agentActive',
    duration: 100,
    frequencies: [400, 600],
  },
}

class AudioManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private masterVolume: number = 0.3

  constructor() {
    this.initAudio()
  }

  private initAudio() {
    try {
      const audioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new audioCtx()
    } catch (e) {
      console.warn('⚠️ Web Audio API not available')
    }
  }

  private resume() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume().catch((e) => console.warn('Audio resume failed:', e))
    }
  }

  play(soundType: SoundType, volume: number = 1) {
    if (!this.enabled || !this.audioContext) return

    this.resume()

    const config = soundConfigs[soundType]
    const now = this.audioContext.currentTime

    // Create a chain of oscillators and envelopes
    config.frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator()
      const gain = this.audioContext!.createGain()
      const masterGain = this.audioContext!.createGain()

      osc.frequency.value = freq
      osc.type = 'sine'

      // Envelope: quick attack, decay
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(1, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration / 1000)

      // Volume
      const delayMs = i * 40 // Stagger frequencies
      masterGain.gain.setValueAtTime(0, now + delayMs / 1000)
      masterGain.gain.setValueAtTime(volume * this.masterVolume, now + delayMs / 1000)

      osc.connect(gain)
      gain.connect(masterGain)
      masterGain.connect(this.audioContext!.destination)

      osc.start(now + delayMs / 1000)
      osc.stop(now + (delayMs + config.duration) / 1000)
    })
  }

  playSequence(sounds: SoundType[], interval: number = 100) {
    sounds.forEach((sound, i) => {
      setTimeout(() => this.play(sound, 0.8), i * interval)
    })
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  getVolume(): number {
    return this.masterVolume
  }
}

export const audioManager = new AudioManager()
