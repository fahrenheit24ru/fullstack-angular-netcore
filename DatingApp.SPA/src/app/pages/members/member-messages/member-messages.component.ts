import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Message } from '../../../models/message';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[] = [];
  newMessage: any = {};
  constructor(
    private _user: UserService,
    private _auth: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this._user.getMessageThread(this._auth.decodedToken.nameid, this.recipientId).subscribe(
      (messages) => {
        this.messages = messages;
      },
      (error) => this._snackBar.open(error.error, 'Error', { duration: 3000 })
    );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this._user.sendMessage(this._auth.decodedToken.nameid, this.newMessage).subscribe(
      (message: Message) => {
        this.messages.unshift(message);
        this.newMessage = '';
      },
      (error) => this._snackBar.open(error.error, 'ERROR SEND', { duration: 3000 })
    );
  }
}
