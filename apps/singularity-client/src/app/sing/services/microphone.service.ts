import { Injectable } from '@angular/core';
import { asyncScheduler, finalize, from, map, Observable, scheduled, switchMap, take, timer } from 'rxjs';

@Injectable()
export class MicrophoneService {

  private selectedMicrophones: string[] = [];
  private audioContext = new AudioContext();

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

  public getDeviceStream$(deviceId: string): Observable<MediaStream> {
    // We are using swicthMap and scheduled here, so that this observable does not become a hot observable.
    return scheduled([1], asyncScheduler)
      .pipe(
        switchMap(() => {
          const promise = navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: deviceId
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
          const analyser = this.audioContext.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.1;
          const sourceNode = this.audioContext.createMediaStreamSource(stream);
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
}
