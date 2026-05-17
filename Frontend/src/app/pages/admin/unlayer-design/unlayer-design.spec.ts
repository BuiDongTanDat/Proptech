import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlayerDesign } from './unlayer-design';

describe('UnlayerDesign', () => {
  let component: UnlayerDesign;
  let fixture: ComponentFixture<UnlayerDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlayerDesign],
    }).compileComponents();

    fixture = TestBed.createComponent(UnlayerDesign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
