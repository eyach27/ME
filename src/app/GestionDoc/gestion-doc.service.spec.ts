import { TestBed } from '@angular/core/testing';

import { GestionDocService } from './gestion-doc.service';

describe('GestionDocService', () => {
  let service: GestionDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
