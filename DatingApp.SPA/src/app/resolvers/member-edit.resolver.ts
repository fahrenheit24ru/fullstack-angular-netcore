import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../shared/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _notify: MatSnackBar,
    private _auth: AuthService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this._userService.getUser(this._auth.decodedToken.nameid).pipe(
      catchError((error) => {
        this._notify.open('Problem retrieving data', 'EDIT');
        this._router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
