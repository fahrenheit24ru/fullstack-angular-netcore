import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { User } from './../../../models/user';
import { AuthService } from '../../../shared/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit, OnDestroy {
  @Input() user: User;
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit() {}
  ngOnDestroy() {}

  sendLike(id: number) {
    this._userService
      .sendLike(this._authService.decodedToken.nameid, id)
      .subscribe(
        (data) => {
          this._snackBar.open(`You have liked ${this.user.knownAs}`, '', { duration: 3000 });
        },
        (error: HttpErrorResponse) => {
          this._snackBar.open(error.error, 'Error', { duration: 3000 });
          return of(error);
        }
      );
  }
}
