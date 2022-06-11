import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(
        private restService: RestService,
        private notificationService: NotificationService
    ) { }

    createAccounts(new_accounts: any[]): Observable<any> {
        return this.restService.post('accounts/create', { new_accounts })
    }
}
