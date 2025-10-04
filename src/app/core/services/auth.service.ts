import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { IAuth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl: string = environment.baseUrl; 
  constructor(private httpClient: HttpClient) {}

  postSignUp(payload: IAuth | any): Observable < any > {
    return this.httpClient.post(`${this.apiBaseUrl}users/signup`, payload)
  }

  postSignIn(payload: IAuth | any): Observable < any > {
    return this.httpClient.post(`${this.apiBaseUrl}users/signIn`, payload)
  }
}