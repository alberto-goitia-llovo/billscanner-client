import { TestBed } from '@angular/core/testing';

import { TestRequestsService } from './test-requests.service';

describe('TestRequestsService', () => {
  let service: TestRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
