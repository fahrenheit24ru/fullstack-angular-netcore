import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';

import { Token } from './types/interfaces';
import { User } from 'app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showLoader = false;
  jwtHelper = new JwtHelperService();
  decodedToken: Token;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(private _http: HttpClient) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(user: User): Observable<{ token: string; user: User }> {
    const request = JSON.stringify(user);
    return this._http.post<{ token: string; user: User }>('api/auth/login', request).pipe(
      tap((response) => {
        if (response) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser = response.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  registration(user: User): Observable<{ token: string }> {
    const request = JSON.stringify(user);
    return this._http.post<{ token: string }>('api/auth/register', request);
  }

  logger(log: string) {
    if (isDevMode()) {
      console.log('PROFILER:', log);
    }
  }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  get Username(): string {
    this.decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    if (this.decodedToken) {
      return this.decodedToken.unique_name;
    }
  }

  show() {
    this.showLoader = true;
  }

  hide() {
    this.showLoader = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.decodedToken = null;
    this.currentUser = null;
  }

  loggedIn(): boolean {
    const token: string = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
