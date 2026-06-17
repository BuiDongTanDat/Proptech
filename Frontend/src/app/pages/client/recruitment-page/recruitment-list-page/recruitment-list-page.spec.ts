import { ComponentFixture, TestBed } from '@angular/core/testing';

import { recruitmentsListPage } from './recruitment-list-page';

describe('recruitmentsListPage', () => {
  let component: recruitmentsListPage;
  let fixture: ComponentFixture<recruitmentsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [recruitmentsListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(recruitmentsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
