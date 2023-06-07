import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  // with intercetor you don't need to add add getHttpOptions
  getMemberList() {
    // of() is an observable that wraps whatever we pass into it
    if (this.members.length > 0) return of (this.members);

    
    return this.http.get<Member[]>(this.baseUrl + "users").pipe(
      // map() is an operator that allows us to transform the data
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName === username);
    if (member !== undefined) return of (member);
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + "users", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        // this will update the member in the members array
        // ... is the spread operator that will spread the member object into individual properties
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  /*
  getMemberList() {
    return this.http.get<Member[]>(this.baseUrl + "users", this.getHttpOptinos());
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + "users/" + username, this.getHttpOptinos());
  }

  
  getHttpOptinos() {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: "Bearer " + user.token
      })
    };
  }
  */
}
