import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringListPage } from './hiring-list-page';

describe('HiringListPage', () => {
  let component: HiringListPage;
  let fixture: ComponentFixture<HiringListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
