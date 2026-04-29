import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTag } from './check-tag';

describe('CheckTag', () => {
  let component: CheckTag;
  let fixture: ComponentFixture<CheckTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckTag],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
