import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SyncService } from './sync.service';
import { CredentialsService } from './credentials.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private rest: RestService,
    private syncService: SyncService,
    private credentialsService: CredentialsService
  ) {
  }

  signin(email: string, password: string): Observable<any> {
    return this.rest.post('/auth/signin', { email, password })
      .pipe(
        map((data: any) => {
          let user = this.credentialsService.storeCredentials(data);
          this.syncService.updateUserData();
          return user;
        }),
      )
  }


  signup(name: string, email: string, password: string): Observable<any> {
    return this.rest.post('/auth/signup', { name, email, password })
      .pipe(
        map((data: any) => {
          let user = this.credentialsService.storeCredentials(data);
          this.syncService.updateUserData();
          return user;
        }),
      )
  }

}
