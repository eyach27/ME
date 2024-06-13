import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLotComponent } from './plan-lot.component';

describe('PlanLotComponent', () => {
  let component: PlanLotComponent;
  let fixture: ComponentFixture<PlanLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanLotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
