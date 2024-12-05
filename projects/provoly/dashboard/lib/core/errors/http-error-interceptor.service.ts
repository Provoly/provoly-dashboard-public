import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';
import { PrySnackbarService } from '../components/snackbar/snackbar.service';
import { PryI18nService } from '../i18n/i18n.service';

export const httpErrorOptions = {
  isDevMode: false
};

@Injectable({ providedIn: 'root' })
export class PryHttpErrorInterceptorService implements HttpInterceptor {
  constructor(
    readonly snackbar: PrySnackbarService,
    private translateService: PryI18nService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (httpErrorOptions.isDevMode) {
          if (error.status >= 400) {
            this.snackbar.dispatchOpenEvent({
              message: this.translateService.instant('@pry.errors.codes.' + error.status),
              type: 'error'
            });
          }
        } else {
          if (error.status >= 400) {
            this.snackbar.dispatchOpenEvent({
              message: this.translateService.instant('@pry.errors.codes.' + error.status),
              type: 'error'
            });
          }
        }
        return throwError(() => error);
      })
    );
  }
}
