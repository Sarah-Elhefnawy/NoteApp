import { Injectable, signal } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userProfile = signal<IUser | null>(null);
  notesCount = signal<number>(0);

  constructor() {
    this.initializeFromStorage();
  }

  // Save user profile data
  saveUserProfile(profile: IUser): void {
    const profileWithDate = {
      ...profile,
      registrationDate: new Date().toISOString() // Store current date
    };
    this.userProfile.set(profileWithDate);
    localStorage.setItem('userProfile', JSON.stringify(profileWithDate));
  }

  // Initialize from localStorage
  private initializeFromStorage(): void {
    try {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        const profile = JSON.parse(stored);
        this.userProfile.set(profile);
      }
    } catch (error) {
      console.warn('Could not load user profile from storage:', error);
    }
  }

  setNotesCount(count: number): void {
    this.notesCount.set(count);
  }
}
