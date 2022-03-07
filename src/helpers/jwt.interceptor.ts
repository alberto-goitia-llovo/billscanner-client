import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authservice: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authservice.currentUserValue;
        console.log('INTERCEPTOR currentUser', currentUser)
        let currentToken = this.authservice.currentTokenValue;
        console.log('INTERCEPTOR currentToken', currentToken)
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