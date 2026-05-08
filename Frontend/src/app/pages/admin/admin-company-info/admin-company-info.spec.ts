import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyInfo } from './admin-company-info';

describe('AdminCompanyInfo', () => {
  let component: AdminCompanyInfo;
  let fixture: ComponentFixture<AdminCompanyInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompanyInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCompanyInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
