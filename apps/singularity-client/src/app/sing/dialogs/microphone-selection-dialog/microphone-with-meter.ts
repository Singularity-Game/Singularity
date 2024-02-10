import { Observable } from 'rxjs';

export interface MicrophoneWithMeter {
  device: MediaDeviceInfo;
  meter$: Observable<number>;
}
