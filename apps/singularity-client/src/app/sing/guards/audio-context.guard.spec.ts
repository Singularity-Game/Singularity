import { TestBed } from '@angular/core/testing';

import { AudioContextGuard } from './audio-context.guard';

describe('AudioContextGuard', () => {
  let guard: AudioContextGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AudioContextGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
