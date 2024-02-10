import { TestBed } from '@angular/core/testing';

import { BpmService } from './bpm.service';

describe('BpmService', () => {
  let service: BpmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
