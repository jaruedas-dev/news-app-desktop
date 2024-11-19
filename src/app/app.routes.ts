import {Routes} from '@angular/router';
import {NewsFormComponent} from "./pages/news-form/news-form.component";
import {NewsMainPageComponent} from "./pages/news-main-page/news-main-page.component";
import {NewsViewArticlePageComponent} from "./pages/news-view-article-page/news-view-article-page.component";

export const routes: Routes = [
  {
    path: '',
    component: NewsMainPageComponent
  },
  {
    path: 'articles/:id',
    component: NewsViewArticlePageComponent
  },
  {
    path: 'articles/:id/edit',
    component: NewsFormComponent
  },
  {
    path: 'create-article',
    component: NewsFormComponent
  }
];
