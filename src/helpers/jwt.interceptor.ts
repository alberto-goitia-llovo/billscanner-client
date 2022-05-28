import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CredentialsService } from '../services/credentials.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private credentialsService: CredentialsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.credentialsService.currentUserValue;
        let currentToken = this.credentialsService.currentTokenValue;
        if (currentUser && currentToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
        }

        return next.handle(request);
    }
}