import {NgIf} from "@angular/common";
import {Component, Input, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Article} from "../../interfaces/news-interface";
import {User} from "../../interfaces/user-interface";
import {NewsImagePipe} from "../../pipes/news-image.pipe";
import {ElectronService} from "../../services/electron.service";
import {LoginService} from "../../services/login.service";
import {NewsService} from "../../services/news.service";
import {UiToolsService} from "../../services/ui-tools.service";
import {isElectron} from "../../shared/functions";

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [
    NewsImagePipe,
    RouterLink,
    NgIf
  ],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent implements OnInit {
  @Input({required: true}) article!: Article;
  isLoggedIn: Boolean = false;
  theme = 'light';
  constructor(
    private uiToolsService: UiToolsService,
    private newsService: NewsService,
    private loginService: LoginService,
    private electronService: ElectronService,
    ) {
  }

  ngOnInit() {
    this.theme = this.electronService.getCurrentTheme();
    this.loginService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  exportArticle(article: Article) {
    console.log(article);
    this.electronService.exportArticle(article).then( (data) => {
      console.log(data);
    });
  }

  async deleteArticle(id: string | undefined) {
    if(!id) return;

    if(isElectron()){
      const confirmed = await this.electronService.showConfirmDialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?'
      });

      if (confirmed) {
        this.newsService.deleteArticle(id).subscribe(() => {
          this.article.is_deleted = '1';
          this.electronService.displayMessage('success', `The article ${this.article.title} has been deleted.`);
        });
      }
    }else{
      this.uiToolsService.displayMessage('Are you sure?', 'This actions cannot be undone!', 'warning', 'Yes, Delete!')
        .then( (resp) => {
          if(resp.isConfirmed){
            this.article.is_deleted = '1';
            this.newsService.deleteArticle(id).subscribe( () => {
                this.uiToolsService.displayToastMessage(`The article ${this.article.title} has been deleted`).then();
            }, error => this.uiToolsService.displayToastMessage(`The article ${this.article.title} has been deleted`).then(() => console.log("Entra")));
          }
        })
    }


  }
}
