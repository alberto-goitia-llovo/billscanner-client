import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private currentTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

  constructor(
    private rest: RestService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentTokenSubject = new BehaviorSubject<any>(String(localStorage.getItem('token')));
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  signin(email: string, password: string): Observable<any> {
    return this.rest.post('/auth/signin', { email, password })
      .pipe(
        map((data: any) => {
          return this.storeCredentials(data);
        }),
      )
  }


  signup(name: string, email: string, password: string): Observable<any> {
    return this.rest.post('/auth/signup', { name, email, password })
      .pipe(
        map((data: any) => {
          return this.storeCredentials(data);
        }),
      )
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.currentTokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  storeCredentials(data: any) {
    let user = data?.user;
    let token = data?.token;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUserSubject.next(user);
    this.currentTokenSubject.next(token);
    return user;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get currentTokenValue(): any {
    return this.currentTokenSubject.value;
  }
}
