import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material';
import { merge } from 'rxjs';

import { Photo } from 'app/models/photo';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  constructor(
    private _auth: AuthService,
    private _userService: UserService,
    private _notify: MatSnackBar
  ) {}

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  ngOnInit() {
    this.initializeUploader();
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: `/api/users/${this._auth.decodedToken.nameid}/photos`,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this._auth.changeMemberPhoto(photo.url);
          this._auth.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this._auth.currentUser));
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this._userService.setMainPhoto(this._auth.decodedToken.nameid, photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter((p) => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.getMemberPhotoChange.emit(photo.url);
        this._auth.changeMemberPhoto(photo.url);
        this._auth.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this._auth.currentUser));
      },
      (error) => this._notify.open(error, '', { duration: 4000 })
    );
  }

  deletePhoto(photo: Photo) {
    const notifyRef = this._notify.open('Are you sure you want to delete this photo?', 'Yes', {
      duration: 5000
    });

    notifyRef.onAction().subscribe(() => {
      this._userService.deletePhoto(this._auth.decodedToken.nameid, photo.id).subscribe(
        () => {
          this.photos.splice(this.photos.findIndex((p) => p.id === photo.id), 1);
          this._notify.open('Photo has been deleted');
        },
        (error) => {
          // console.log(error);
          let text: string;
          if (error.status === 409) {
            text = error.error;
          }
          this._notify.open(text, '', { duration: 3000 });
        }
      );
    });
  }
}
