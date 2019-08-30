import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('api')) {
      return next.handle(req);
    }

    const modified = req.clone({ setHeaders: { 'X-Man': 'Wolverine' } });

    return next.handle(modified);
  }
}
