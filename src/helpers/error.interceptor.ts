import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AlertService, InterceptedAlerts } from '../services/alert.service'

const HANDLED_ALERTS: InterceptedAlerts = {
    "jwt expired": { message: 'Session expired', type: "error" }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private alertService: AlertService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
            }

            const error = err.error.message || err.statusText;
            let alert = HANDLED_ALERTS[error];
            if (alert) this.alertService.queueAlert(alert.message, alert.type)
            return throwError(error);
        }))
    }
}