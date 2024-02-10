import { filter, map, Observable, Subject, Subscription } from 'rxjs';
import * as Tone from 'tone';
import { Nullable } from '@singularity/api-interfaces';
import { SingerNote } from './singer-note';
import init, { McLeodDetector } from 'pitch-detection-wasm';

export class PitchDetector {
  private readonly context = Tone.context;
  private readonly toneAnalyser = this.context.createAnalyser();
  private readonly pitchSubject = new Subject<Nullable<number>>();
  private running = true;
  private source: MediaStreamAudioSourceNode;
  private detector?: McLeodDetector;
  private subscription?: Subscription;

  constructor(source: MediaStreamAudioSourceNode) {
    this.source = source;
    this.source.connect(this.toneAnalyser);
  }

  private createPitchMessages(): void {
    init('wasm/pitch_detection_wasm_bg.wasm').then(() => {
      this.toneAnalyser.fftSize = 2048;
      this.detector = McLeodDetector.new(this.toneAnalyser.fftSize, this.toneAnalyser.fftSize / 2);
      this.detect();
    });
  }

  private detect(): void {
    const buffer = new Float32Array(this.toneAnalyser.fftSize)
    this.toneAnalyser.getFloatTimeDomainData(buffer);

    const result = new Float32Array(2);
    this.detector?.get_pitch(buffer, Tone.context.sampleRate, 0.15, 0.7, result);

    this.pitchSubject.next(result[0]);

    if (this.running) {
      window.requestAnimationFrame(() => this.detect());
    }
  }

  public getPitch$(): Observable<number | null> {
    if (!this.subscription) {
      this.createPitchMessages();
    }
    return this.pitchSubject.asObservable();
  }

  public getNote$(): Observable<SingerNote | null> {
    let startNote: Nullable<SingerNote> = null;
    let lastNote: Nullable<SingerNote> = null;

    return this.getPitch$().pipe(
      map((pitch: Nullable<number>) => {
        if (pitch === null || isNaN(pitch) || pitch === -1) {
          startNote = null;
          return null;
        }

        if (startNote === null) {
          startNote = new SingerNote(pitch, null);
        }

        const note = new SingerNote(pitch, startNote);

        if (isNaN(note.noteNumberInt)) {
          return null;
        }

        return note;
      }),
      filter((note: Nullable<SingerNote>) => {
        const result = lastNote && note ? Math.abs(note.noteNumberFloat - lastNote.noteNumberFloat) <= 3 : true

        if (result) {
          lastNote = note;
        }

        return result;

      })
    )
  }

  public dispose(): void {
    this.running = false;
    if (this.source) {
      this.source.disconnect();
    }
  }
}
