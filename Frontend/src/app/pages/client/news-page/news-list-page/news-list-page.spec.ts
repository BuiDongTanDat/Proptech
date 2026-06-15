import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListPage } from './news-list-page';

describe('NewsListPage', () => {
  let component: NewsListPage;
  let fixture: ComponentFixture<NewsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
