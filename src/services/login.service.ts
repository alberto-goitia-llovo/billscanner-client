import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AlertService } from './alert.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

const handledErrorMessages: any = {
  "User already exists": { message: 'This user already exists. Please login.' },
  "Invalid Password": { message: 'Invalid password' },
  "User not registered": { message: 'User not registered' }
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private rest: RestService,
    private alerter: AlertService,
  ) { }

  signin(email: string, password: string): Observable<any> {
    return this.rest.post('/api/auth/signin', { email, password })
      .pipe(
        catchError(this.handleError())
      )
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.rest.post('/api/auth/signup', { name, email, password })
      .pipe(
        catchError(this.handleError())
      )
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
