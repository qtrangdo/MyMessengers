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
  private userId: string;

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

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(() => this.router.navigate(['/']), err => this.authStatusListener.next(false))
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(data => {
        this.token = data.token;
        if (this.token) {
          const expiresInDuration = data.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = data.userId;

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);

          this.router.navigate(['/']);
        } else this.router.navigate(['/login']);
      }, err => this.authStatusListener.next(false))
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) return;
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
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
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, expiresInDuration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId")
    if (!token || !expirationDate || !userId) return;
    return { token, expirationDate: new Date(expirationDate), userId };
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
}
