import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardsComponent } from './news-cards.component';

describe('NewsCardsComponent', () => {
  let component: NewsCardsComponent;
  let fixture: ComponentFixture<NewsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
