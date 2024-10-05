import { TestBed } from '@angular/core/testing';

import { PartyParticipantGuard } from './party-participant.guard';

describe('PartyParticipantGuard', () => {
  let guard: PartyParticipantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PartyParticipantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
