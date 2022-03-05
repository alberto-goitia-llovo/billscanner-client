import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AlertService } from './alert.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';

const handledErrorMessages: any = {
  "User already exists": { message: 'This user already exists. Please login.' },
  "Invalid Password": { message: 'Invalid password' },
  "User not registered": { message: 'User not registered' }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(localStorage.getItem('currentUser'));
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();
  private holamundo: string = 'hola mundo';

  constructor(
    private rest: RestService,
    private alerter: AlertService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.holamundo = 'hello world';
  }

  signin(email: string, password: string): Observable<any> {
    console.log("Estamos dentro de signin --> ", this.holamundo);
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
    console.log("Estoy haciendo un logout")
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  storeCredentials(data: any) {
    let user = data?.data?.user;
    let token = data?.data?.token;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', JSON.stringify(token));
    this.currentUserSubject.next(user);
    return user;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }


  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      if (handledErrorMessages[error?.error?.message]) {
        this.alerter.queueAlert(handledErrorMessages[error?.error?.message].message, 'error')
      } else {
        this.alerter.queueAlert("An error has occurred", 'error')
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
