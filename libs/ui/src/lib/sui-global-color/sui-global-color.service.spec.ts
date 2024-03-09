import { TestBed } from '@angular/core/testing';

import { SuiGlobalColorService } from './sui-global-color.service';

describe('SuiGlobalColorService', () => {
  let service: SuiGlobalColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiGlobalColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
