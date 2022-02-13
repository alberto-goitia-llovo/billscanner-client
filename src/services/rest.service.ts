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


  get<T>(url: string, params = {}): Observable<T> {
    let full_url = this.IP_SERVER + url;
    return this.http.get<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
      tap(_ => this.logger.logWithTime(`GET ${full_url}`)),
    )
  }

  post<T>(url: string, body = {}): Observable<T> {
    let full_url = this.IP_SERVER + url;
    return this.http.post<T>(full_url, body, { headers: this.httpOptions.headers })
      .pipe(
        tap(_ => this.logger.logWithTime(`POST ${full_url}`)),
      )
  }

  delete<T>(url: string, params = {}): Observable<T> {
    let full_url = this.IP_SERVER + url;
    return this.http.delete<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
      tap(_ => this.logger.logWithTime(`DELETE ${full_url}`)),
    )
  }

  put<T>(url: string, params = {}): Observable<T> {
    let full_url = this.IP_SERVER + url;
    return this.http.put<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
      tap(_ => this.logger.logWithTime(`PUT ${full_url}`)),
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * 
   * @note Won't be using this function but it stays here in case needed.
   * All the REST operations will be transformed from observables to promises
   * and handled at the specific service that made the request (for convenience)
   * 
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      this.logger.log(`${operation} failed`);
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

//USING PROMISES, ANTIPATTERN
// get<T>(url: string, params = {}): Promise<T> {
//   let full_url = this.IP_SERVER + url;
//   return new Promise((resolve, reject) => {
//     this.http.get<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
//       tap(_ => this.logger.logWithTime(`GET ${full_url}`)),
//     )
//       .toPromise()
//       .then(resolve)
//       .catch((err) => {
//         this.logger.logWithTime(`POST failed`)
//         reject(err.error)
//       })
//   })
// }

// post<T>(url: string, body = {}): Promise<T> {
//   let full_url = this.IP_SERVER + url;
//   return new Promise((resolve, reject) => {
//     this.http.post<T>(full_url, body, { headers: this.httpOptions.headers })
//       .pipe(
//         tap(_ => this.logger.logWithTime(`POST ${full_url}`)),
//       )
//       .toPromise()
//       .then(resolve)
//       .catch((err) => {
//         this.logger.logWithTime(`POST failed`)
//         reject(err.error)
//       })
//   })
// }

// delete<T>(url: string, params = {}): Promise<T> {
//   let full_url = this.IP_SERVER + url;
//   return new Promise((resolve, reject) => {
//     this.http.delete<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
//       tap(_ => this.logger.logWithTime(`DELETE ${full_url}`)),
//     )
//       .toPromise()
//       .then(resolve)
//       .catch((err) => {
//         this.logger.logWithTime(`POST failed`)
//         reject(err.error)
//       })
//   })
// }

// put<T>(url: string, params = {}): Promise<T> {
//   let full_url = this.IP_SERVER + url;
//   return new Promise((resolve, reject) => {
//     this.http.put<T>(full_url, { params, headers: this.httpOptions.headers }).pipe(
//       tap(_ => this.logger.logWithTime(`PUT ${full_url}`)),
//     )
//       .toPromise()
//       .then(resolve)
//       .catch((err) => {
//         this.logger.logWithTime(`POST failed`)
//         reject(err.error)
//       })
//   })
// }