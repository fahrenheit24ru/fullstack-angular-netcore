import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User, UserParams } from './../models/user';
import { PaginatedResult } from '../models/pagination';
import { Message } from '../models/message';

@Injectable()
export class UserService {
  constructor(private _http: HttpClient) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?: UserParams,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (userParams) {
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this._http
      .get<User[]>(`api/users`, {
        observe: 'response',
        params
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this._http.get<User>(`api/users/${id}`);
  }

  updateUser(id: number, user: User) {
    return this._http.put(`api/users/${id}`, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this._http.post(`api/users/${userId}/photos/${id}/setMain`, {});
  }

  deletePhoto(userId: number, id: number) {
    return this._http.delete(`api/users/${userId}/photos/${id}`);
  }

  sendLike(id: number, recipientId: number) {
    return this._http.post(`api/users/${id}/like/${recipientId}`, {});
  }

  getMessages(
    id: number,
    page?,
    itemsPerPage?,
    messageContainer?
  ): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this._http
      .get<Message[]>(`api/users/${id}/messages`, { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipient: number): Observable<Message[]> {
    return this._http.get<Message[]>(`api/users/${id}/messages/thread/${recipient}`);
  }

  sendMessage(id: number, message: Message) {
    console.log(id, message);
    return this._http.post(`api/users/${id}/messages`, message);
  }
}
