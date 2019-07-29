import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../_models/Auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor (private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(data => console.log(data))
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
      .subscribe(data => {
        this.token = data.token;
        if (this.token) {
          const expiresInDuration = data.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate);

          this.router.navigate(['/']);
        } else this.router.navigate(['/login']);
      })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) return;
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, expiresInDuration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString())
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) return;
    return { token, expirationDate: new Date(expirationDate) };
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
}
