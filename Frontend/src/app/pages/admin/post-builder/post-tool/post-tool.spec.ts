import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTool } from './post-tool';

describe('PostTool', () => {
  let component: PostTool;
  let fixture: ComponentFixture<PostTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTool],
    }).compileComponents();

    fixture = TestBed.createComponent(PostTool);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
