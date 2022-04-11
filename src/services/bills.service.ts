import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { IBill } from '../interfaces/bills.interface';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private restService: RestService,
    private notificationService: NotificationService
  ) { }

  upload(bills_array: IBill[]) {
    return this.restService.post('bills/upload', { bills: bills_array })
    // .pipe(catchError((err) => {
    //   this.notificationService.toast.error('Error', 'Could not upload bills');
    //   throw err;
    // }));
  }
}
