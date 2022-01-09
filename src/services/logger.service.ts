import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  public logWithTime(message: any) {
    if (!environment.web_logger) return;
    if (message) console.log(`[${new Date().toLocaleString()}] ${message}`);
  }

  public log(message: any) {
    if (!environment.web_logger) return;
    if (message) console.log(`[${new Date().toLocaleString()}] ${message}`);
  }
}
