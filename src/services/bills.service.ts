import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { IBillDTO } from '../interfaces/bills.interface';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private restService: RestService,
    private notificationService: NotificationService
  ) { }

  upload(bills_array: IBillDTO[] | null): Observable<any> {
    return this.restService.post('bills/upload', { bills: bills_array })
  }
}
