import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../_models/Auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private http: HttpClient) { }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(data => console.log(data))
  }
}
