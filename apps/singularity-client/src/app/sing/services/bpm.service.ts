import { Injectable } from '@angular/core';
import { delay, Observable, Subject, take } from 'rxjs';
import * as Tone from 'tone'
import { SettingsService } from '../../shared/settings/settings.service';
import { LocalSettings } from '../../shared/settings/local-settings';

@Injectable()
export class BpmService {
  private delay = 0;
  private running = false;
  private currentBeat = 0;
  private beatSubject = new Subject<number>();
  private startSubject = new Subject<void>();
  private stopSubject = new Subject<void>();
  constructor(private readonly settingsService: SettingsService) {
    Tone.Transport.scheduleRepeat(() => {
      this.beatSubject.next(this.currentBeat);
      this.currentBeat++;
    }, '16n');
  }

  public setBPM(bpm: number, delay: number): void {
    Tone.Transport.bpm.value = bpm;
    this.delay = delay;
  }

  public start(): void {
    if (this.running) {
      return;
    }

    this.startSubject.next();
    this.currentBeat = 0;
    Tone.Transport.start(`+${this.delay / 1000}`);
    this.running = true;
  }

  public stop(): void {
    if (!this.running) {
      return;
    }

    this.stopSubject.next();
    Tone.Transport.stop();
    this.running = false;
  }

  public getBeat$(): Observable<number> {
    return this.beatSubject.asObservable();
  }

  public getBeatWithMicrophoneLatency$(): Observable<number> {
    const microphoneLatency = this.settingsService.getLocalSetting(LocalSettings.MicrophoneLatency);

    return this.getBeat$()
      .pipe(delay(+(microphoneLatency ?? 0)));
  }
  public onStart$(): Observable<void> {
    return this.startSubject.asObservable().pipe(take(1));
  }

  public onStartWithMicrophoneLatency$(): Observable<void> {
    const microphoneLatency = this.settingsService.getLocalSetting(LocalSettings.MicrophoneLatency);

    return this.onStart$()
      .pipe(delay(+(microphoneLatency ?? 0)));
  }

  public onStop$(): Observable<void> {
    return this.stopSubject.asObservable().pipe(take(1));
  }

  public onStopWithMicrophoneLatency$(): Observable<void> {
    const microphoneLatency = this.settingsService.getLocalSetting(LocalSettings.MicrophoneLatency);

    return this.onStop$()
      .pipe(delay(+(microphoneLatency ?? 0)));
  }
}
