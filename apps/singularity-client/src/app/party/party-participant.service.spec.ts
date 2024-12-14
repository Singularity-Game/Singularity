import { TestBed } from '@angular/core/testing';

import { PartyParticipantService } from './party-participant.service';

describe('PartyParticipantService', () => {
  let service: PartyParticipantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartyParticipantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
