import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormLotComponent } from './add-form-lot.component';

describe('AddFormLotComponent', () => {
  let component: AddFormLotComponent;
  let fixture: ComponentFixture<AddFormLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFormLotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
