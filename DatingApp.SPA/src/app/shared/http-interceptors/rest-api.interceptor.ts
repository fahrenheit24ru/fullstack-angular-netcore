import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

const apiPathProduction = environment.apiUrl;

/** Pass untouched request through to the next request handler. */
@Injectable()
export class RestAPIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiPath = req.clone({
      url: req.url.replace('/api', apiPathProduction)
    });
    // send the cloned, "secure" request to the next handler.
    return next.handle(apiPath);
  }
}
