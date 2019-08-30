import { User } from './models/user';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from './shared/auth.service';
import { AuthComponent } from './shared/auth/auth.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isFetching = false;
  isSideBySide = false;
  private isSideNavDoc = false;
  isAuth: boolean;
  username: string;
  photoUrl: string;
  get isOpened() {
    return this.isSideBySide && this.isSideNavDoc;
  }

  constructor(private _auth: AuthService, public dialog: MatDialog, private _router: Router) {}

  ngOnInit(): void {
    this.loginCheck();
    this._auth.currentPhotoUrl.subscribe((photoUrl) => (this.photoUrl = photoUrl));
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (!this.isAuth) {
      this.openDialog();
    }
    if (user) {
      this._auth.currentUser = user;
      this._auth.changeMemberPhoto(user.photoUrl);
    }
  }

  logout() {
    this._auth.logout();
    this.isAuth = this._auth.loggedIn();
    this._router.navigate(['/']);
    this.openDialog();
  }

  loginCheck() {
    this.isAuth = this._auth.loggedIn();
    this.username = this._auth.Username;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      width: '300px'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(
      () => {
        this.loginCheck();
      },
      (err) => {},
      () => this._router.navigate(['/members'])
    );
  }
}
