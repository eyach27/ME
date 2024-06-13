import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocByDepComponent } from './doc-by-dep.component';

describe('DocByDepComponent', () => {
  let component: DocByDepComponent;
  let fixture: ComponentFixture<DocByDepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocByDepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocByDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
