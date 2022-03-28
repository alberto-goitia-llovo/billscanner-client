import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

const handledErrorMessages: any = {
  "User already exists": { message: 'This user already exists. Please login.' },
  "Invalid Password": { message: 'Invalid password' },
  "User not registered": { message: 'User not registered' }
}

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
    private messageService: MessageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentTokenSubject = new BehaviorSubject<any>(String(localStorage.getItem('token')));
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  signin(email: string, password: string): Observable<any> {
    return this.rest.post('/api/auth/signin', { email, password })
      .pipe(
        map((data: any) => {
          return this.storeCredentials(data);
        }),
        catchError(this.handleError())
      )
  }


  signup(name: string, email: string, password: string): Observable<any> {
    return this.rest.post('/api/auth/signup', { name, email, password })
      .pipe(
        map((data: any) => {
          return this.storeCredentials(data);
        }),
        catchError(this.handleError())
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
    let user = data?.data?.user;
    let token = data?.data?.token;
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


  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log("SE HA DETECTADO UN ERROR")
      console.error(error); // log to console instead
      console.log(error)
      console.log(error.message)
      console.log('error?.error?.message', error?.error?.message)
      if (handledErrorMessages[error?.error?.message]) {
        console.log("mandando un mensagitoooo")
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Authentication error', detail: handledErrorMessages[error?.error?.message].message });
      } else {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'An error has occurred', detail: '' });
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
