import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { Pagination, PaginatedResult, Paginator } from '../../models/pagination';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../shared/auth.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  pageSizeOptions: number[] = [6, 12, 24];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this._route.data.subscribe((data) => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
    });
  }

  ngOnDestroy() {}

  loadMessages() {
    this._userService
      .getMessages(
        this._authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (response: PaginatedResult<Message[]>) => {
          this.messages = response.result;
          this.pagination = response.pagination;
        },
        (error: HttpErrorResponse) => {
          this._snackBar.open(error.error, '', { duration: 4000 });
        }
      );
  }

  pageChanged(event: Paginator) {
    const n = event.pageIndex + 1;
    this.pagination.currentPage = n;
    this.loadMessages();
  }
}
