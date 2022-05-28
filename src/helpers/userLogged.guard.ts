import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { CredentialsService } from '../services/credentials.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedGuard implements CanActivate {

  constructor(
    private credentialsService: CredentialsService,
    private messageService: MessageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.credentialsService.currentUserValue;
    const token = this.credentialsService.currentTokenValue;
    if (currentUser && token) {
      // logged in so return true
      return true;
    }

    // this.alertService.queueAlert("Login required", "info");
    this.messageService.add({ key: 'globaltoast', severity: 'info', summary: 'Login required', detail: '' });
    // not logged in so redirect to login page with the return url
    this.credentialsService.logout();
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
