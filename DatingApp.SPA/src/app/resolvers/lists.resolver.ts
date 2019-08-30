import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from 'app/models/user';
import { UserService } from '../services/user.service';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 6;
  likesParam = 'Likers';

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this._userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam).pipe(
      catchError((error: HttpErrorResponse) => {
        this._snackBar.open('Problem retrieving data', '', { duration: 4000 });
        this._router.navigate(['/']);
        return of(null);
      })
    );
  }
}
