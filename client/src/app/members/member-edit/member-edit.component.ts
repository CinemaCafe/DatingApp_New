import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  // to get access to the form
  @ViewChild("editForm") editForm: NgForm | undefined;
  // to prevent unsaved changes
  // $event.returnValue = true; is a statement that will be executed when the window:beforeunload event is raised
  // when the user tries to close the browser tab or window or navigate away from the page without saving the changes made to the form 
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event: any) {
    if(this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;

  
  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      {
        next: user => this.user = user
      });

  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if(!this.user) return;

    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    });
  }

  updateMember() {
    console.log(this.member);
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
          this.toastr.success("Profile updated successfully");
          // ? is a null coalescing operator
          // if editForm is null, then reset will not be called
          // the question mark (?) is used to guard against null and undefined values in property paths
          // reload the form
          this.editForm?.reset(this.member);
      }
    });

  }

}
