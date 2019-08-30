import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { User } from './../../../models/user';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit, OnDestroy {
  user: User;
  photoUrl: string;
  @ViewChild('editForm', { static: false }) editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _notify: MatSnackBar,
    private _userService: UserService,
    private _auth: AuthService
  ) {}
  ngOnInit() {
    this._route.data.subscribe((data) => {
      this.user = data['user'];
    });
    this._auth.currentPhotoUrl.subscribe((photoUrl) => (this.photoUrl = photoUrl));
  }

  updateUser() {
    this._userService.updateUser(+this._auth.decodedToken.nameid, this.user).subscribe(
      (next) => {
        this.editForm.reset(this.user);
        this._notify.open('Profile updated successfully', '', { duration: 3000 });
      },
      (error: HttpErrorResponse) => {
        this._notify.open(error.statusText, '', { duration: 4000 });
      }
    );
  }

  updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
  ngOnDestroy() {}
}
