import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesdocComponent } from './mesdoc.component';

describe('MesdocComponent', () => {
  let component: MesdocComponent;
  let fixture: ComponentFixture<MesdocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesdocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
