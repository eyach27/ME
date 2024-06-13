import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEnattenteComponent } from './user-enattente.component';

describe('UserEnattenteComponent', () => {
  let component: UserEnattenteComponent;
  let fixture: ComponentFixture<UserEnattenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEnattenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEnattenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
