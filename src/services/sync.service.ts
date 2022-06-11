import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { IBillDTO } from '../interfaces/bills.interface';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { CredentialsService } from './credentials.service';
import { Subject, BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { ISync } from '../interfaces/sync.interface';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class SyncService {
    syncData$: BehaviorSubject<ISync | {}> = new BehaviorSubject(JSON.parse(localStorage.getItem('syncData') || '{}'));
    constructor(
        private restService: RestService,
        private credentialsService: CredentialsService,
        private notificationService: NotificationService
    ) { }

    updateSyncData$: Observable<ISync | null> = this.restService.get('/sync/getSyncData').pipe(
        map((data: any) => {
            console.log('data', data)
            localStorage.setItem('syncData', JSON.stringify(data));
            this.syncData$.next(data)
            return data;
        }),
        catchError((err) => {
            this.notificationService.toast.error('Error', 'Could not update user data')
            return of(null);
        })
    );
}
