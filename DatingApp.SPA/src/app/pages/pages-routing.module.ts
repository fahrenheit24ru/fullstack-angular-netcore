import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from '../resolvers/member-detail.resolver';
import { MemberListResolver } from 'app/resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from 'app/resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from 'app/shared/guards/prevent-unsaved-changes.guard';
import { ListsResolver } from 'app/resolvers/lists.resolver';
import { MessagesResolver } from 'app/resolvers/messages.resolver';

const pages: Routes = [
  {
    path: '',
    redirectTo: 'members',
    pathMatch: 'full'
  },
  {
    path: 'members',
    component: MemberListComponent,
    resolve: { users: MemberListResolver }
  },
  {
    path: 'members/edit',
    component: MemberEditComponent,
    resolve: { user: MemberEditResolver },
    canDeactivate: [PreventUnsavedChanges]
  },
  {
    path: 'members/:id',
    component: MemberDetailComponent,
    resolve: { user: MemberDetailResolver }
  },
  {
    path: 'lists',
    component: ListsComponent,
    resolve: { users: ListsResolver }
  },
  {
    path: 'messages',
    component: MessagesComponent,
    resolve: { messages: MessagesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(pages)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
