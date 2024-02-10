import { TestBed } from '@angular/core/testing';

import { SongManagementService } from './song-management.service';

describe('SongManagementService', () => {
  let service: SongManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
