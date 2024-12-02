import {JsonPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {NewsCardsComponent} from './components/news-cards/news-cards.component';
import {News} from './interfaces/news-interface';
import {User} from "./interfaces/user-interface";
import {ElectronService} from "./services/electron.service";
import {LoginService} from "./services/login.service";
import {NewsService} from './services/news.service';
import {isElectron} from "./shared/functions";

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
  user: User | null = null;
  constructor(
    private newsService: NewsService,
    private electronService: ElectronService,
    private loginService: LoginService) {}

  ngOnInit(): void {
    if(isElectron()){
      this.electronService.setTheme();

      this.loginService.isUserLoaded().subscribe(userLoaded => {
        if (userLoaded) {
          this.loginService.isLoggedIn().subscribe(() => {
            this.user = this.loginService.getUser();

            if(this.user) {
              this.electronService.displayMessage("Welcome", `Welcome back ${this.user!.username}`);
              this.newsService.updateApiKey(this.user.token);
            }
          });
        }
      });
    }

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
