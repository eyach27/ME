import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFavComponent } from './doc-fav.component';

describe('DocFavComponent', () => {
  let component: DocFavComponent;
  let fixture: ComponentFixture<DocFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocFavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
