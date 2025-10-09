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
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errorMsg = signal<string>('');

  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)
  private readonly _UserService = inject(UserService);

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    age: new FormControl('', [Validators.required]),
    // phone: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
    // password:  new FormControl('', [Validators.required, Validators.pattern(/^\w{6,}$/)])
    // password:  new FormControl('', [Validators.required, Validators.pattern(/^\[A-Z][a-z0-9]{6,10}$/)])
  });

  submitForm(): void {
    if (this.signupForm.valid) {
      this.errorMsg.set('');
      this._AuthService.postSignUp(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('Signup successful', response);

          // Save user data using the service
          this._UserService.saveUserProfile({
            name: this.signupForm.value.name,
            email: this.signupForm.value.email,
            age: this.signupForm.value.age,
            phone: this.signupForm.value.phone
          });

          this._Router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          this.errorMsg.set(error.error.msg || 'An error occurred during signup');
        }
      });
    }
  }
}
