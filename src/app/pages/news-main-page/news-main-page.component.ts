import { JsonPipe, NgIf } from "@angular/common";
import {Component, OnInit, ChangeDetectorRef, ApplicationRef} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { NewsCardsComponent } from '../../components/news-cards/news-cards.component';
import { Article, ArticleDetails } from '../../interfaces/news-interface';
import { ElectronService } from "../../services/electron.service";
import { LoginService } from "../../services/login.service";
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-main-page',
  standalone: true,
  imports: [NewsCardsComponent, NavBarComponent, JsonPipe, NgIf],
  templateUrl: './news-main-page.component.html',
  styleUrls: ['./news-main-page.component.css'],
})
export class NewsMainPageComponent implements OnInit {
  articles: Article[] = []; // Artículos filtrados
  isLogged = false;

  constructor(
    private newsService: NewsService,
    private loginService: LoginService,
    private electronService: ElectronService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
  private appRef: ApplicationRef
) {}

  ngOnInit() {
    this.loginService.isLoggedIn().subscribe(isLogged => {
      this.isLogged = isLogged;
    });

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

  async importArticle() {
    const importedArticle = await this.electronService.importArticle();
    let article: ArticleDetails = {};
    if (importedArticle) {
      const { id, update_date, is_deleted, is_public, ...rest } = importedArticle;
      Object.assign(article, rest);

      // Create a new array to trigger change detection
      this.articles = [...this.articles, article];
      this.cdr.markForCheck(); // Mark for change detection
      this.appRef.tick();

      this.newsService.createArticle(article).subscribe((data) => {
        article.id = data.id;
        this.electronService.displayMessage('Import Article', 'Article has been imported successfully.');
      });
    }
  }
}
