import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../_modules/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}
  //loggedIn = false;
  currentUser$: Observable<User | null> = of(null);

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    // this.getCurrentUser();
    // this.currentUser$ = this.accountService.currentUser$
  }


  // getCurrentUser() {
  //   this.accountService.currentUserSource$.subscribe({
  //     next: user => this.loggedIn = !!user,
  //     error: err => console.log(err)
  //   })
  // }

  login() {
    this.accountService.login(this.model).subscribe({
      next: respone => {
        console.log(respone);
        // this.loggedIn = true;
      },
      error: err => console.log(err)
    });
  }

  logout() {
    // remove item from localStorage
    this.accountService.logout();
    // this.loggedIn = false;

  }

}
