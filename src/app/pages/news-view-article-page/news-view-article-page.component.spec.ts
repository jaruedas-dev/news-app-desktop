import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsViewArticlePageComponent } from './news-view-article-page.component';

describe('NewsViewArticlePageComponent', () => {
  let component: NewsViewArticlePageComponent;
  let fixture: ComponentFixture<NewsViewArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsViewArticlePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsViewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
