import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _snackBar: MatSnackBar) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('api')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      // retry(2),
      catchError((error: HttpErrorResponse) => {
        // const applicationError = error.headers.get('Application-Error');
        if (error.status === 401) {
          this._snackBar.open(error.statusText, '', { duration: 3000 });
        } else if (error.status === 403) {
          this._snackBar.open('Invalid username or password', '', { duration: 3000 });
        } else if (error.status === 500) {
          this._snackBar.open('The server has died, try your request later', '', {
            duration: 4000
          });
        } else {
          this._snackBar.open(error.message, '', { duration: 3500 });
        }
        return throwError(error);
      })
    );
  }
}
