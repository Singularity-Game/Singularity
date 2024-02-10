import { TestBed } from '@angular/core/testing';

import { MicrophoneGuard } from './microphone.guard';

describe('MicrophoneGuard', () => {
  let guard: MicrophoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MicrophoneGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
