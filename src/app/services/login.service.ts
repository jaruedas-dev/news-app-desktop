import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {User} from '../interfaces/user-interface';

const BASE_URL = environment.NEWS_HTTP;
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user: User | null = null;
  private loggedIn = new BehaviorSubject<boolean>(false);

  private loginUrl = `${BASE_URL}/login`;

  private message: string | null = null;

  private httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'x-www-form-urlencoded'),
  };

  constructor(private http: HttpClient) {}

  isLogged() {
    return this.user != null;
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(name: string, pwd: string): Observable<User> {
    const usereq = new HttpParams().set('username', name).set('passwd', pwd);

    return this.http.post<User>(this.loginUrl, usereq).pipe(
      tap((user) => {
        this.user = user;
        this.loggedIn.next(true);
      })
    );
  }

  getUser() {
    return this.user;
  }

  logout() {
    this.user = null;
    this.loggedIn.next(false);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.user = null;
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}