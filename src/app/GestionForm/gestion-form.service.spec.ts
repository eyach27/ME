import { TestBed } from '@angular/core/testing';

import { gestionFormService } from "./gestion-form.service";

describe('gestionFormService', () => {
  let service: gestionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(gestionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});