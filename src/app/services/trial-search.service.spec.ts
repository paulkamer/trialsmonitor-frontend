import { TestBed } from '@angular/core/testing';

import { TrialSearchService } from './trial-search.service';

describe('TrialSearchService', () => {
  let service: TrialSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
