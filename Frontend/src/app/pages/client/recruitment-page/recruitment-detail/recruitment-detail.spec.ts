import { ComponentFixture, TestBed } from '@angular/core/testing';

import { recruitmentsDetail } from './recruitment-detail';

describe('recruitmentsDetail', () => {
  let component: recruitmentsDetail;
  let fixture: ComponentFixture<recruitmentsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [recruitmentsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(recruitmentsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
