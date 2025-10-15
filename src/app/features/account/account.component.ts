import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NoteService } from '../../core/services/note.service';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  private _UserService = inject(UserService);
  private _NoteService = inject(NoteService);

  userData = this._UserService.userProfile;
  notesCount = this._UserService.notesCount;

  ngOnInit() {
    setTimeout(() => {
      this.loadNotesCount();
    }, 500);
  }

  // Load notes count asynchronously
  loadNotesCount(): void {
    this._NoteService.getNotes().subscribe({
      next: (response) => {
        const count = response.notes?.length || 0;
        this._UserService.setNotesCount(count);
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
        this._UserService.setNotesCount(0);
      }
    });
  }

  // Get registration date from user profile
  getRegistrationDate(): string {
    const user = this.userData();

    // If we have registration date stored, use it
    if (user?.registrationDate) {
      return new Date(user.registrationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Otherwise, try to get from token (if available)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const tokenData = JSON.parse(decodedPayload);

        if (tokenData.iat) {
          return new Date(tokenData.iat * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      } catch (error) {
        console.warn('Could not decode token for registration date:', error);
      }
    }

    return 'Recently';
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}