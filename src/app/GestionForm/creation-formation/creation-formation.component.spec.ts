import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationFormationComponent } from './creation-formation.component';

describe('CreationFormationComponent', () => {
  let component: CreationFormationComponent;
  let fixture: ComponentFixture<CreationFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationFormationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
