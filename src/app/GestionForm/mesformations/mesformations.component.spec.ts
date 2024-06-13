import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesformationsComponent } from './mesformations.component';

describe('MesformationsComponent', () => {
  let component: MesformationsComponent;
  let fixture: ComponentFixture<MesformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
