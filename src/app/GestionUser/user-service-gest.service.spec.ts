import { TestBed } from '@angular/core/testing';

import { UserServiceGestService } from './user-service-gest.service';

describe('UserServiceGestService', () => {
  let service: UserServiceGestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServiceGestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
