import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGalleryModule } from 'ngx-gallery';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../shared/material/material.module';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from '../resolvers/member-detail.resolver';
import { UserService } from '../services/user.service';
import { MemberListResolver } from 'app/resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from 'app/resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from 'app/shared/guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';
import { ListsResolver } from '../resolvers/lists.resolver';
import { MessagesResolver } from 'app/resolvers/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';

@NgModule({
  declarations: [
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TimeAgoPipe,
    MemberMessagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    NgxGalleryModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  exports: [],
  providers: [
    MemberDetailResolver,
    UserService,
    MemberListResolver,
    MemberEditResolver,
    ListsResolver,
    PreventUnsavedChanges,
    MessagesResolver
  ]
})
export class PagesModule {}
