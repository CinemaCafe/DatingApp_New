import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}
  //loggedIn = false;
  currentUser$: Observable<User | null> = of(null);

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

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
        // console.log(respone);
        // this.loggedIn = true;
        this.router.navigateByUrl("/members");
      },
      error: err => {
        //console.log(err.error)
        // remove the error message because that's being handled inside our intercepter now.
        //this.toastr.error(err.error);
      }
    });
  }

  logout() {
    // remove item from localStorage
    this.accountService.logout();
    // this.loggedIn = false;
    this.router.navigateByUrl("/");

  }

}
