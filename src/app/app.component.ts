import {JsonPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {NewsCardsComponent} from './components/news-cards/news-cards.component';
import {News} from './interfaces/news-interface';
import {NewsService} from './services/news.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, JsonPipe, NewsCardsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  categories: string[] = [];
  category: string = '';
  news: News = {};

  constructor(private newsService: NewsService) {}


  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((resp) => {
      this.news = resp;
      this.newsService.getCategories().subscribe((categories) => {
        this.categories = categories;
        this.category = categories[1];
        this.changeCategory(this.category);
      });
    });
  }

  changeCategory(category: string) {
    this.newsService.setSelectedCategory(category);
  }

  changeSearchText(searchText: string) {
    this.newsService.setSearchText(searchText)
  }
}
