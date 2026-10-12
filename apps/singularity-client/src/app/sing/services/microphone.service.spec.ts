import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MicrophoneService } from './microphone.service';

describe('MicrophoneService', () => {
  let service: MicrophoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrophoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('requests microphone access and stops its tracks after permission is granted', async () => {
    let requestedConstraints: MediaStreamConstraints | undefined;
    let trackStopped = false;
    const mediaDevicesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices');
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: (constraints: MediaStreamConstraints) => {
          requestedConstraints = constraints;
          return Promise.resolve({
            getTracks: () => [{
              stop: () => {
                trackStopped = true;
              }
            }]
          } as unknown as MediaStream);
        }
      }
    });

    try {
      await firstValueFrom(service.requestPermission$());

      expect(requestedConstraints).toEqual({ audio: true });
      expect(trackStopped).toBe(true);
    } finally {
      if (mediaDevicesDescriptor) {
        Object.defineProperty(navigator, 'mediaDevices', mediaDevicesDescriptor);
      } else {
        Reflect.deleteProperty(navigator, 'mediaDevices');
      }
    }
  });
});
