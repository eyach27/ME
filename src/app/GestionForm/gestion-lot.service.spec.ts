import { TestBed } from '@angular/core/testing';

import { gestionLotService } from "./gestion-lot.service";

describe('gestionLotService', () => {
  let service: gestionLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(gestionLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});