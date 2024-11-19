import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleDetails} from "../../interfaces/news-interface";
import {NewsImagePipe} from "../../pipes/news-image.pipe";
import {NewsService} from "../../services/news.service";

@Component({
  selector: 'app-news-view-article-page',
  standalone: true,
  imports: [
    NewsImagePipe,
  ],
  templateUrl: './news-view-article-page.component.html',
  styleUrl: './news-view-article-page.component.css'
})
export class NewsViewArticlePageComponent implements OnInit {
  id: string = ''
  article: ArticleDetails = {
    abstract: "",
    body: "",
    category: "",
    id: "",
    id_user: "",
    image_data: "",
    image_description: undefined,
    image_media_type: "",
    is_deleted: "",
    is_public: "",
    subtitle: "",
    title: "",
    update_date: "",
    username: ""
  }

  constructor(private newsService: NewsService, private activatedRoute: ActivatedRoute, private route: Router) {
    this.id = activatedRoute.snapshot.params['id'];

    if(!this.id) {
      this.route.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.newsService.getArticle(this.id).subscribe((resp) => {
      this.article = resp;
    });
  }

}
