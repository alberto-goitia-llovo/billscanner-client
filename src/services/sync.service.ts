import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { IBill } from '../interfaces/bills.interface';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { CredentialsService } from './credentials.service';
import { Subject, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class SyncService {
    userData: BehaviorSubject<any> = new BehaviorSubject(JSON.parse(localStorage.getItem('userData') || '{}') || {});
    constructor(
        private restService: RestService,
        private credentialsService: CredentialsService,
        private notificationService: NotificationService
    ) {
        let user_logged = !!this.credentialsService.currentUserValue;
        if (user_logged && _.isEmpty(this.userData.value)) {
            this.updateUserData();
        }
    }

    updateUserData() {
        return this.restService.get('/sync/getUserData')
            .subscribe({
                next: (data) => {
                    console.log('data updated', data)
                    localStorage.setItem('userData', JSON.stringify(data));
                    this.userData.next(data)
                },
                error: (err) => { this.notificationService.toast.error('Error', 'Could not update user data') }
            })
    }
}
