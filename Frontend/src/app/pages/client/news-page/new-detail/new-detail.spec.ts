import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDetail } from './new-detail';

describe('NewDetail', () => {
  let component: NewDetail;
  let fixture: ComponentFixture<NewDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
