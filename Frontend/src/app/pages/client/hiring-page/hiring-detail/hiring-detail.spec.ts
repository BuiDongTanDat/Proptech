import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringDetail } from './hiring-detail';

describe('HiringDetail', () => {
  let component: HiringDetail;
  let fixture: ComponentFixture<HiringDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
