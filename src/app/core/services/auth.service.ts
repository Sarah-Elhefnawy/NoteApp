import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { IAuth } from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl: string = environment.baseUrl;
  userToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private _Router = inject(Router)

  constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private id: Object) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    if (isPlatformBrowser(this.id)) {
      try {
        const token = localStorage.getItem('token');
        if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
          this.userToken.next(token);
        } else {
          this.userToken.next(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.warn('Could not initialize auth state:', error);
        this.userToken.next(null);
      }
    }
  }

  postSignUp(payload: IAuth | any): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}users/signup`, payload)
  }

  postSignIn(payload: IAuth | any): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}users/signIn`, payload)
  }

  setUserToken(token: string): void {
  if (typeof localStorage !== 'undefined' && localStorage) {
    try {
      localStorage.setItem('token', token);
      this.userToken.next(token);
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }
}

logOut() {
  localStorage.removeItem('token');
  this.userToken.next(null);
  this._Router.navigate(['/login']);
}
}