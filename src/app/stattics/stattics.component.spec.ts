import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatticsComponent } from './stattics.component';

describe('StatticsComponent', () => {
  let component: StatticsComponent;
  let fixture: ComponentFixture<StatticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
