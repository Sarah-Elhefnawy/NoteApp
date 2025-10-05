import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { IAuth } from '../interfaces/auth.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl: string = environment.baseUrl; 
  userToken: BehaviorSubject<any> = new BehaviorSubject('');
  private _Router = inject(Router)
  constructor(private httpClient: HttpClient) {}

  postSignUp(payload: IAuth | any): Observable < any > {
    return this.httpClient.post(`${this.apiBaseUrl}users/signup`, payload)
  }

  postSignIn(payload: IAuth | any): Observable < any > {
    return this.httpClient.post(`${this.apiBaseUrl}users/signIn`, payload)
  }

  setUserToken() {
  if (typeof localStorage !== 'undefined' && localStorage) {
    try {
      let token = localStorage.getItem('token');
      if (token != null && token !== 'null' && token !== 'undefined') {
        this.userToken.next(token);
      }
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }
}

logOut() {
  if (typeof localStorage !== 'undefined' && localStorage) {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.warn('Could not remove token from localStorage:', error);
    }
  }
  this._Router.navigate(['/logIn']);
}
}