import {JsonPipe} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {NavBarComponent} from '../../components/nav-bar/nav-bar.component';
import {NewsCardsComponent} from '../../components/news-cards/news-cards.component';
import {Article} from '../../interfaces/news-interface'; // Asegúrate de importar Article
import {NewsService} from '../../services/news.service';

@Component({
  selector: 'app-news-main-page',
  standalone: true,
  imports: [NewsCardsComponent, NavBarComponent, JsonPipe],
  templateUrl: './news-main-page.component.html',
  styleUrl: './news-main-page.component.css',
})
export class NewsMainPageComponent implements OnInit {
  articles: Article[] = []; // Artículos filtrados

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.selectedCategory$.pipe(
      switchMap(() => this.newsService.getArticles())
    ).subscribe(articles => {
      this.articles = articles;
    });

    this.newsService.searchText$.pipe(
      switchMap(() => this.newsService.getArticles())
    ).subscribe(articles => {
      this.articles = articles;
    });

  }
}
