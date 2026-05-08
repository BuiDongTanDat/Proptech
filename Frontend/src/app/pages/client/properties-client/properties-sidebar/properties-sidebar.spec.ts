import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesSidebar } from './properties-sidebar';

describe('PropertiesSidebar', () => {
  let component: PropertiesSidebar;
  let fixture: ComponentFixture<PropertiesSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
