import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of,} from "rxjs";
import {environment} from "../../environments/environment";
import {Article, ArticleDetails, News} from "../interfaces/news-interface";
import newsUPM from "../shared/newsUPM.json";

const API_URL = environment.NEWS_HTTP;
const API_KEY = environment.API_KEY;
const PERFORM_REQUESTS = environment.PERFORM_REQUESTS;
const ARTICLE_URL = `${API_URL}/article`;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  news: News = {};
  categories: string[] = [];
  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySubject.asObservable();
  private searchTextBehavior = new BehaviorSubject<string>('');
  searchText$ = this.searchTextBehavior.asObservable();
  apiKey: string = API_KEY;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `PUIRESTAUTH apikey=${this.apiKey}`
    })
  };



  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<string[]> {
    return of(this.categories);
  }

  setSelectedCategory(category: string){
    this.selectedCategorySubject.next(category);
  }

  setSearchText(searchText: string){
    this.searchTextBehavior.next(searchText);
  }

  getAllNews(): Observable<News> {
    if(Object.keys(this.news).length > 0){
      return of(this.getNewsObject());
    }

    if(PERFORM_REQUESTS) {
      return this.getNews().pipe(
        map(result => {
          result.forEach(article => {
            this.initializeObject(article.category!);
            this.news[article.category!].articles.push(article);
          });
          return this.getNewsObject();
        })
      );
    }

    newsUPM.map( (article: Article) => {
      this.initializeObject(article.category!);
      this.news[article.category!].articles.push(article);
    });

    return of(this.getNewsObject());
  }

  private initializeObject(category: string){
    if(!this.categories.includes(category)){
      this.categories.push(category);
    }
    if (!this.news[category]) {
      this.news[category] = { articles: [] };
    }
  }

  getArticles():Observable<Article[]>{
    let articles:Article[] = [];
    const allCategories = this.selectedCategorySubject.value === '' ? 1 : 0;

    Object.keys(this.news).forEach( (category: string | undefined) => {
      if(this.searchTextBehavior.value !== ''){
        if(allCategories || this.selectedCategorySubject.value == category)
           this.news[category!].articles.filter( article => {
            if((article.title!.toLowerCase().includes(this.searchTextBehavior.value.toLowerCase()))
                || (article.subtitle!.toLowerCase().includes(this.searchTextBehavior.value.toLowerCase()))
              || (article.abstract!.toLowerCase().includes(this.searchTextBehavior.value.toLowerCase()))){
              articles.push(article);
            }})
      }else{
        if(allCategories || this.selectedCategorySubject.value == category){
          articles.push(...this.news[category!].articles)
        }
      }
    })

    return of(articles);
  }

  getNewsObject(): News {
    return this.news;
  }

  getNews(): Observable<Article[]> {
    return this.http.get<Article[]>(`${API_URL}/articles`, this.httpOptions);
  }

  getArticle(id: string): Observable<ArticleDetails> {
    return this.http.get<ArticleDetails>(`${ARTICLE_URL}/${id}`, this.httpOptions);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete<Article>(`${ARTICLE_URL}/${id}`, this.httpOptions);
  }

  updateArticle(article: ArticleDetails): Observable<any> {
    return this.http.post<any>(`${ARTICLE_URL}`, article, this.httpOptions);
  }

  createArticle(article: ArticleDetails): Observable<any> {
      return this.http.post<any>(`${ARTICLE_URL}`, article,  this.httpOptions)
        .pipe( map((resp) => {
          if(resp['status'] === 200) {
            this.news[article.category!].articles.push(article);
          }
          return resp;
      }));
  }

  updateApiKey(apikey: string){
    if(apikey){
      this.apiKey = apikey;
    }else{
      this.apiKey = API_KEY;
    }
  }
}
