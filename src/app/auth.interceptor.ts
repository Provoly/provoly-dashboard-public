import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token = '';

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token && this.token.length > 0) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this.token}` }
      });
    }

    return next.handle(request);
  }
}
