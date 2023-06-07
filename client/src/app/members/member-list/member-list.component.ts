import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //membersObj: Member[] = [];
  membersObj$: Observable<Member[]> | undefined;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    //this.loadMember();
    // in the member-list.component.html we use async pipe to subscribe to the observable
    this.membersObj$ = this.memberService.getMemberList()
  }

  // loadMember() {
  //   this.memberService.getMemberList().subscribe({
  //     next: members => this.membersObj = members
  //   });
  // }
}
