import { Injectable } from '@angular/core';
import { asyncScheduler, defer, finalize, from, map, Observable, scheduled, switchMap, take, tap, timer } from 'rxjs';

@Injectable({providedIn: 'root'})
export class MicrophoneService {

  private selectedMicrophones: string[] = [];
  private audioContext?: AudioContext;

  public isAnyMicrophoneSelected(): boolean {
    return this.selectedMicrophones.length > 0;
  }

  public setMicrophones(deviceIds: string[]): void {
    this.selectedMicrophones = deviceIds;
  }

  public getSelectedMicrophones(): string[] {
    return this.selectedMicrophones;
  }

  public getDevices$(): Observable<MediaDeviceInfo[]> {
    return from(navigator.mediaDevices.enumerateDevices())
      .pipe(
        map((devices: MediaDeviceInfo[]) => devices.filter((device: MediaDeviceInfo) => device.kind === 'audioinput')),
        take(1)
      )
  }

  public requestPermission$(): Observable<void> {
    return defer(() => from(navigator.mediaDevices.getUserMedia({ audio: true })))
      .pipe(
        tap((stream: MediaStream) => stream.getTracks().forEach(track => track.stop())),
        map(() => undefined)
      );
  }

  public getDeviceStream$(deviceId: string): Observable<MediaStream> {
    // We are using swicthMap and scheduled here, so that this observable does not become a hot observable.
    return scheduled([1], asyncScheduler)
      .pipe(
        switchMap(() => {
          const promise = navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: { exact: deviceId }
            }
          });

          return from(promise);
        })
      );
  }

  public getDeviceMeter$(deviceId: string): Observable<number> {
    return this.getDeviceStream$(deviceId)
      .pipe(
        switchMap((stream: MediaStream) => {
          const analyser = this.getAudioContext().createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.1;
          const sourceNode = this.getAudioContext().createMediaStreamSource(stream);
          sourceNode.connect(analyser);

          return timer(0, 100).pipe(
            map(() => {
              const fftBins = new Float32Array(analyser.frequencyBinCount);
              analyser.getFloatFrequencyData(fftBins);

              const frequencyRangeData = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(frequencyRangeData);
              const sum = frequencyRangeData.reduce((previous: number, current: number) => previous + current, 0);

              return Math.sqrt(sum / frequencyRangeData.length);
            }),
            finalize(() => {
              sourceNode.disconnect();
              stream.getTracks().forEach(track => track.stop());
            })
          );
        })
      );
  }

  private getAudioContext(): AudioContext {
    this.audioContext ??= new AudioContext({ latencyHint: 0 });
    return this.audioContext;
  }
}
