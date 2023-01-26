import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // input component from HomeComponent
  // @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {}

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    //console.log(this.model);
    this.accountService.register(this.model).subscribe({
      next: () => {
        //console.log(response);
        this.cancel();
      },
      error: err => console.log(err)
    })
  }

  cancel() {
    // do anything in emit();
    this.cancelRegister.emit(false);
  }
}
