import { Nullable } from '@singularity/api-interfaces';
import * as Tone from 'tone';

export class NormalizedLoudnessAudioPlayer {
  private readonly TARGET_LUFS = -16;
  private readonly MAX_PEAK_DB = -1;

  private readonly audioContext: Tone.BaseContext;
  private audioPlayer: Nullable<HTMLAudioElement> = null;
  private sourceNode: Nullable<MediaElementAudioSourceNode> = null;
  private gainNode: Nullable<Tone.Gain> = null;
  private volume = 1;
  private onStopFn: Nullable<() => void> = null;
  private onEndedFn: Nullable<() => void> = null;

  constructor(audioContext: Tone.BaseContext) {
    this.audioContext = audioContext;
  }

  public registerOnStop(fn: () => void): void {
    this.onStopFn = fn;

    if (this.audioPlayer) {
      this.audioPlayer.onpause = this.onStopFn;
    }
  }

  public registerOnEnded(fn: () => void): void {
    this.onEndedFn = fn;

    if (this.audioPlayer) {
      this.audioPlayer.onended = this.onStopFn;
    }
  }

  public isPaused(): boolean {
    return this.audioPlayer?.paused ?? true;
  }

  public setVolume(volume: number): void {
    this.volume = volume;
  }

  public async play(audio: Blob, lufs: number, peakDb: number) {
    this.stop();
    this.audioPlayer = new Audio(URL.createObjectURL(audio));
    this.audioPlayer.volume = 1;

    this.sourceNode = this.audioContext.createMediaElementSource(this.audioPlayer);
    this.gainNode = new Tone.Gain(
      this.volume * this.normalizationGain(lufs, peakDb)
    ).toDestination();

    Tone.connect(this.sourceNode, this.gainNode);

    this.audioPlayer.onpause = this.onStopFn;
    this.audioPlayer.onended = this.onEndedFn;

    await this.audioContext.resume();
    await this.audioPlayer.play();
  }

  public stop(): void {
    this.audioPlayer?.pause();
    this.sourceNode?.disconnect();
    this.gainNode?.disconnect();

    if (this.audioPlayer) {
      URL.revokeObjectURL(this.audioPlayer.src);
    }

    this.audioPlayer = null;
    this.sourceNode = null;
    this.gainNode = null;
  }

  private normalizationGain(lufs: number, peakDb: number): number {
    let gainDb = this.TARGET_LUFS - lufs;

    // Clipping protection
    if (Number.isFinite(peakDb)) {
      gainDb = Math.min(gainDb, this.MAX_PEAK_DB - peakDb);
    }

    return 10 ** (gainDb / 20)
  }
}
