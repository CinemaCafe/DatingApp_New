import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  
  constructor(private accountService : AccountService, private memberService : MembersService) { 
    // get the current user
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      // get the user from the observable
      next: user => {
        
        if(user) this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }
  
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo : Photo) { 
    this.memberService.setMainPhoto(photo.id).subscribe({
      // update the current user in the local storage
      next: () => {
        if(this.user && this.member) {
          // update the current user in the local storage
          this.user.photoUrl = photo.url;
          // the reason that we're doing that is because our current user observable components are subscribing to the current user object.
          // Specificallly the nav component is subscribing to the current user object and it's going to be updating the photoUrl property.
          // it will update the photoUrl property of the user object in the nav component beacuse the nav component is subscribing to the current user object.
          this.accountService.setCurrentUser(this.user);
          // the member is from the member-detail component
          // this will update the photoUrl property of the member object in the member-detail component
          this.member.photoUrl = photo.url;
          // use foreach to set the isMain property of the photo object to true if the photo object is the main photo
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id == photo.id) p.isMain = true;
          });
        }
      }
    });
  }

  deletePhoto(photoId : number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next:() => {
        if(this.member) {
          // filter out the photo with the photoId it will return a new array of photos and we're going to set the photos array to that new array of photos
          // it will let the browser know that the array has changed and it will update the browser
          this.member.photos = this.member.photos.filter(x => x.id !== photoId);
        }
      }
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url : this.baseUrl + 'users/add-photo',
      authToken : 'Bearer ' + this.user?.token,
      isHTML5 : true,
      allowedFileType : ['image'],
      removeAfterUpload : true,
      autoUpload : false,
      maxFileSize : 10 * 1024 * 1024 // 10 MB
    });

    // we need to set the headers for the file uploader
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item : any, response : any, status : any, headers : any) => {
      if(response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain && this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }
}

