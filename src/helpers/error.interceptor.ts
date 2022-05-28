import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
export type AlertType = "error" | "warn" | "success" | "info";
export type InterceptedAlerts = {
    [errorMessage: string]: { message: string, type: AlertType }
};

const HANDLED_ALERTS: InterceptedAlerts = {
    "jwt expired": { message: 'Session expired', type: "error" }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private messageService: MessageService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(err);
            let message = err.error.message;
            if (err.status === 0) message = 'Server is not responding';
            console.log(message);
            this.messageService.add({ key: 'globaltoast', severity: 'error', summary: message, detail: '' });
            return throwError(() => err);
        }))
    }
}