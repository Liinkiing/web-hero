import {Fret} from './utils/interfaces';
import guitarNotes from './guitar_notes.json'

const BASE_URL = process.env.REACT_APP_SOUNDS_URL
const DELAYED_STOP = 1.5
const ZERO = 0.000001

class AudioEngine {

  get state() {
    return this.context.state
  }

  get playingBuffers() {
    return this.playings
  }

  public volume = 0.9

  private context: AudioContext = new AudioContext()
  private readonly masterGain: GainNode
  private readonly limiterNode: DynamicsCompressorNode
  private readonly guitarGain: GainNode
  private sound?: AudioBuffer;
  private playings: {
    [fret: string]: {
      source: AudioBufferSourceNode,
      gain: GainNode
    }
  } = {}

  constructor() {
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.setValueAtTime(this.volume, 0);

    this.limiterNode = this.context.createDynamicsCompressor();
    this.limiterNode.threshold.setValueAtTime(-10, 0)
    this.limiterNode.knee.setValueAtTime(0, 0)
    this.limiterNode.ratio.setValueAtTime(20, 0)
    this.limiterNode.attack.setValueAtTime(0, 0)
    this.limiterNode.release.setValueAtTime(0.1, 0)
    this.limiterNode.connect(this.masterGain);

    this.guitarGain = this.context.createGain();
    this.guitarGain.gain.setValueAtTime(0.5, 0)
    this.guitarGain.connect(this.limiterNode);

  }

  public async init() {
    this.masterGain.gain.setValueAtTime(0., 0)
    this.sound = await this.preloadGuitar()
    this.masterGain.gain.setValueAtTime(this.volume, 0)
  }

  public resume = (): Promise<void> => {
    return this.context.resume()
  }

  public play = (note: Fret, volume = 0.5, stopDelay = 1.5): void => {
    const keyId = note + Date.now()
    const source = this.context.createBufferSource();
    source.onended = this.onEndedSound.bind(this, keyId)
    source.buffer = this.sound!;
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(this.volume * volume, 0);
    source.connect(gain);
    gain.connect(this.guitarGain);
    source.start(0, guitarNotes[note].offset, 3.69);
    if (this.playings[keyId]) {
      const playing = this.playings[keyId];
      playing.gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + stopDelay);
    }
    this.playings[keyId] = {
      source,
      gain
    };
  }

  public stopBufferedSounds = (): void => {
    for (const key of Object.keys(this.playings)) {
      this.playings[key].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + DELAYED_STOP);
    }
  }

  public stop = (note: Fret, stopDelay = 1.5, sustained = false): void => {
    const keyId = note + Date.now()
    if (this.playings[keyId]) {
      if (!sustained) {
        this.playings[keyId].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + stopDelay);
        this.playings[keyId].source.stop(this.context.currentTime + stopDelay)
        setTimeout(() => {
          delete this.playings[keyId]
        }, stopDelay + 0.01)
      }
    }
  }

  private preloadGuitar = async (): Promise<AudioBuffer> => {
    return this.context.decodeAudioData(await (await fetch(`${BASE_URL}/guitar.wav`)).arrayBuffer())
  }

  private onEndedSound = (keyId: string): void => {
    delete this.playings[keyId]
  }

}

const audioEngine = new AudioEngine()
export default audioEngine
