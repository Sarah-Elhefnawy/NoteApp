import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMsg = signal<string>('');

  private readonly _AuthService = inject(AuthService)
  private readonly _UserService = inject(UserService)
  private readonly _Router = inject(Router)

  signinForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
    // password:  new FormControl('', [Validators.required, Validators.pattern(/^\w{6,}$/)])
    // password:  new FormControl('', [Validators.required, Validators.pattern(/^\[A-Z][a-z0-9]{6,10}$/)])
  });

  submitForm(): void {
    if (this.signinForm.valid) {
      this._AuthService.postSignIn(this.signinForm.value).subscribe({
        next: (response) => {
          // console.log('LogIn successful', response);
          localStorage.setItem('token', response.token);

          // Load user profile data after successful login
          const userEmail = this.signinForm.value.email;
          this._UserService.loadUserProfile(userEmail);

          this._AuthService.setUserToken(response.token);
          this._Router.navigate(['/home']);
        },
        error: (error) => {
          console.error('LogIn failed', error);
          this.errorMsg.set(error.error.msg);
        }
      });
    }
  }
}
