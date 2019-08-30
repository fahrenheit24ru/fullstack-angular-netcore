import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

import { Message } from './../models/message';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 6;
  messageContainer = 'Unread';
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _notify: MatSnackBar,
    private _authService: AuthService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Message[]> {
    return this._userService
      .getMessages(
        this._authService.decodedToken.nameid,
        this.pageNumber,
        this.pageSize,
        this.messageContainer
      )
      .pipe(
        catchError((error) => {
          this._notify.open('Problem retrieving messages', 'MESSAGES');
          this._router.navigate(['/']);
          return of(null);
        })
      );
  }
}
