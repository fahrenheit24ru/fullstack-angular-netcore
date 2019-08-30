import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { User } from '../../../models/user';
import {
  Pagination,
  PaginatedResult,
  Paginator,
  PaginationResponse
} from '../../../models/pagination';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  userParams: any = {};
  pageSizeOptions: number[] = [6, 12, 24];
  pagination: Pagination;
  pageEvent: PageEvent;
  startPage = 1;
  filters: string[] = ['lastActive', 'created'];

  constructor(private _route: ActivatedRoute, private _userService: UserService) {}

  ngOnInit() {
    this._route.data.subscribe((data: PaginationResponse<User[]>) => {
      this.pagination = data.users.pagination;
      this.users = data.users.result;
    });
    this.defaultParams();
  }

  pageChanged(event: Paginator) {
    this.startPage = event.pageIndex + 1;
    this.loadUsers(this.startPage, event.pageSize);
  }

  resetFilters() {
    this.defaultParams();
    this.loadUsers(1, this.pagination.itemsPerPage);
  }

  defaultParams() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 40;
    this.userParams.orderBy = 'lastActive';
  }

  loadUsers(page, itemsPerPage) {
    this._userService
      .getUsers(page, itemsPerPage, this.userParams)
      .subscribe((response: PaginatedResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      });
  }

  ngOnDestroy() {}
}
