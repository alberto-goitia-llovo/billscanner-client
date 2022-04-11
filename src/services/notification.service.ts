import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    public toast: Toast,
    public message: Message
  ) { }
}

@Injectable({
  providedIn: 'root'
})
class Toast {
  constructor(private messageService: MessageService) { }

  success(summary: string = '', detail: string = '', key = 'globaltoast') {
    this.messageService.add({ key, severity: 'success', summary, detail });
  }

  error(summary: string = '', detail: string = '', key = 'globaltoast') {
    this.messageService.add({ key, severity: 'error', summary, detail });
  }

  info(summary: string = '', detail: string = '', key = 'globaltoast') {
    this.messageService.add({ key, severity: 'info', summary, detail });
  }

  warn(summary: string = '', detail: string = '', key = 'globaltoast') {
    this.messageService.add({ key, severity: 'warn', summary, detail });
  }
}

@Injectable({
  providedIn: 'root'
})
class Message {
  constructor(private messageService: MessageService) { }

  success(summary: string = '', detail: string = '', key) {
    this.messageService.clear(key);
    this.messageService.add({ key, severity: 'success', summary, detail });
  }

  error(summary: string = '', detail: string = '', key) {
    this.messageService.clear(key);
    this.messageService.add({ key, severity: 'error', summary, detail });
  }

  info(summary: string = '', detail: string = '', key) {
    this.messageService.clear(key);
    this.messageService.add({ key, severity: 'info', summary, detail });
  }

  warn(summary: string = '', detail: string = '', key) {
    this.messageService.clear(key);
    this.messageService.add({ key, severity: 'warn', summary, detail });
  }

  clear(key: string) {
    this.messageService.clear(key);
  }
}
