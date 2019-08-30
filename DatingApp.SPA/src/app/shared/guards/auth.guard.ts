import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _notify: MatSnackBar,
    public dialog: MatDialog
  ) {}

  canActivate(): boolean {
    if (this._auth.loggedIn()) {
      return true;
    }

    this._notify.open('You shall not pass', '', { duration: 4000 });
    this._router.navigate(['/']);
    return false;
  }
}
