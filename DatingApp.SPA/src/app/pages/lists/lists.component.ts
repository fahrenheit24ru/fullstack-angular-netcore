import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../../models/user';
import {
  Pagination,
  PaginationResponse,
  PaginatedResult,
  Paginator
} from '../../models/pagination';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnDestroy {
  users: User[] = [];
  pagination: Pagination;
  likesParam: string;
  pageSizeOptions: number[] = [6, 12, 24];
  startPage = 1;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this._route.data.subscribe((data: PaginationResponse<User[]>) => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });

    this.likesParam = 'Likers';
  }

  ngOnDestroy() {}

  pageChanged(event: Paginator) {
    this.startPage = event ? event.pageIndex + 1 : 1;
    this.loadUsers(this.startPage, this.pagination.itemsPerPage, this.likesParam);
  }

  loadUsers(page, itemsPerPage, likesParam) {
    this._userService
      .getUsers(page, itemsPerPage, null, likesParam)
      .subscribe((response: PaginatedResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
      });
  }
}
