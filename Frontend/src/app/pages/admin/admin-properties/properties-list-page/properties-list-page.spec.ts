import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesListPage } from './properties-list-page';

describe('PropertiesListPage', () => {
  let component: PropertiesListPage;
  let fixture: ComponentFixture<PropertiesListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
