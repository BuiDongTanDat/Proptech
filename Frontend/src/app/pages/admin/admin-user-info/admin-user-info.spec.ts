import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserInfo } from './admin-user-info';

describe('AdminUserInfo', () => {
  let component: AdminUserInfo;
  let fixture: ComponentFixture<AdminUserInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
