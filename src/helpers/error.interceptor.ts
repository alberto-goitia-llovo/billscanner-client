import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import { AuthService } from '../services/auth.service';

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
        private authService: AuthService,
        private messageService: MessageService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('err', err)
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
            }

            const error = err.error.message || err.statusText;
            let alert = HANDLED_ALERTS[error];
            if (alert) {
                this.messageService.add({ key: 'tst', severity: alert.type, summary: '', detail: alert.message });
            }

            return throwError(() => err);
        }))
    }
}