import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // with intercetor you don't need to add add getHttpOptions
  getMemberList() {
    return this.http.get<Member[]>(this.baseUrl + "users");
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + "users/" + username);
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
