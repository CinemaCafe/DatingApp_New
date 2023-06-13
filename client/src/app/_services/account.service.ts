import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  // create observable
  // BehaviorSubject<Type of User>
  // BehaviorSubject is a type of Subject that allows you to set the initial value
  // BehaviorSubject also gives you the previous value when subscribed to
  // BehaviorSubject needs an initial value as it must always return a value on subscription even if it hasn't received a next()
  private currentUserSource = new BehaviorSubject<User | null>(null);

  // expose the observable as a property
  // $ is a convention to indicate that this is an observable
  // currentUser$ is an observable that can be subscribed to
  currentUser$ = this.currentUserSource.asObservable();

  // to inject HttpClient method
  constructor(private http: HttpClient) { }

  login(model: any) {
    // post http request
    // post<Type of User>
    // pipe() is used to chain RxJS operators
    // map() is an RxJS operator that allows us to transform the data
    // map() is used to transform the response data into the User object
    // map() is used to set the user object to the currentUserSource
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          // set value to Network/localStorage
          // localStorage.setItem("user", JSON.stringify(user));
          // set value to observable
          // this.currentUserSource.next(user);
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if (user) {
          // localStorage.setItem("user", JSON.stringify(user));
          // this.currentUserSource.next(user);
          this.setCurrentUser(user);
        }
        //return user;
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
