import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

import { AuthService } from '../auth.service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class AuthComponent implements OnInit {
  form = 'registration'; // || 'registration' || 'reset-password';
  user: any = {};
  hidePassword = true;
  hideConfirm = true;
  registerForm: FormGroup;
  genders: string[] = ['male', 'female'];

  events: string[] = [];

  login = new FormGroup({
    username: new FormControl('Lola', [Validators.required]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(8)
    ])
  });
  constructor(
    private _auth: AuthService,
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notify: MatSnackBar,
    private _router: Router
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8)
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        gender: new FormControl('male'),
        knownAs: new FormControl('', Validators.required),
        dateOfBirth: new FormControl(moment([2017, 0, 1]), Validators.required),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      },
      this.passwordMatchValidator
    );
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };
  }

  loginForm() {
    this.form = 'login';
    this.hidePassword = true;
    this.hideConfirm = true;
    this.login.reset();
  }

  sendLogin() {
    this.user = Object.assign({}, this.login.value);
    this._auth.login(this.user).subscribe(() => {
      this.dialogRef.close();
    });
  }

  registrationForm() {
    this.form = 'registration';
    this.hidePassword = true;
    this.hideConfirm = true;
    this.registerForm.reset();
  }

  sendRegistration() {
    if (this.registerForm.status === 'INVALID') {
      this._notify.open('Form invalid', '', { duration: 3500 });
    }
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this._auth.registration(this.user).subscribe(
        () => {
          this._notify.open('Registration successful', '', { duration: 4000 });
        },
        (error) => this._notify.open(error, '', { duration: 4000 }),
        () => {
          this._auth.login(this.user).subscribe(() => {
            this._router.navigate(['/members']);
          });
        }
      );
    }
  }
}
