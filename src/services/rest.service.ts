import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  IP_SERVER = environment.ip_server;


  get<T>(url: string, params = {}): Promise<T> {

    let full_url = this.IP_SERVER + url;
    return new Promise((resolve, reject) => {
      this.http.get<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
        tap(_ => this.logger.logWithTime(`GET ${full_url}`)),
        catchError(this.handleError<T>("GET"))
      ).subscribe((res) => resolve(res))
    })
  }

  post<T>(url: string, body = {}): Promise<T> {
    let full_url = this.IP_SERVER + url;
    return new Promise((resolve, reject) => {
      // this.http.post<T>(full_url, body, { headers: this.httpOptions.headers }).pipe(
      //   tap(_ => this.logger.logWithTime(`POST ${full_url}`)),
      //   catchError(this.handleError<T>("POST"))
      // ).subscribe((res) => resolve(res))
      this.http.post<T>(full_url, body, { headers: this.httpOptions.headers })
        .pipe(
          tap(_ => this.logger.logWithTime(`POST ${full_url}`)),
          catchError(this.handleError<T>("POST"))
        )
        .toPromise()
        .then(resolve)
        .catch((err) => {
          reject(err.error)
        })
    })
  }

  delete<T>(url: string, params = {}): Promise<T> {
    let full_url = this.IP_SERVER + url;
    return new Promise((resolve) => {
      this.http.delete<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
        tap(_ => this.logger.logWithTime(`DELETE ${full_url}`)),
        catchError(this.handleError<T>("DELETE"))
      ).subscribe((res) => resolve(res))
    })
  }

  put<T>(url: string, params = {}): Promise<T> {
    let full_url = this.IP_SERVER + url;
    return new Promise((resolve) => {
      this.http.put<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
        tap(_ => this.logger.logWithTime(`PUT ${full_url}`)),
        catchError(this.handleError<T>("PUT"))
      ).subscribe((res) => resolve(res))
    })
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      this.logger.log(`${operation} failed`);
      throw new Error(error);
      // console.error(error); // log to console instead
      // // Let the app keep running by returning an empty result.
      // return of(result as T);
    };
  }
}
