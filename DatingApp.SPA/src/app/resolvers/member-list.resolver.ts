import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 6;
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _notify: MatSnackBar
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {
    return this._userService.getUsers(this.pageNumber, this.pageSize).pipe(
      catchError((error) => {
        this._notify.open('Problem retrieving data', 'LIST');
        this._router.navigate(['/']);
        return of(null);
      })
    );
  }
}
