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

  // Generate a unique key for each user's data
  private getUserStorageKey(email: string): string {
    return `userProfile_${email}`;
  }

  // Save user profile data with email-based key
  saveUserProfile(profile: IUser): void {
    const profileWithDate = {
      ...profile,
      registrationDate: new Date().toISOString()
    };
    
    this.userProfile.set(profileWithDate);
    
    // Store user data with email-based key
    const userKey = this.getUserStorageKey(profile.email);
    localStorage.setItem(userKey, JSON.stringify(profileWithDate));
    
    // Also store the current user's email for quick lookup
    localStorage.setItem('currentUserEmail', profile.email);
  }

  // Load user profile by email
  loadUserProfile(email: string): void {
    try {
      const userKey = this.getUserStorageKey(email);
      const stored = localStorage.getItem(userKey);
      
      if (stored) {
        const profile = JSON.parse(stored);
        this.userProfile.set(profile);
        
        // Update current user email
        localStorage.setItem('currentUserEmail', email);
      } else {
        console.warn('No user profile found for:', email);
        this.userProfile.set(null);
      }
    } catch (error) {
      console.warn('Could not load user profile from storage:', error);
      this.userProfile.set(null);
    }
  }

  // Initialize from localStorage - try to load current user
  private initializeFromStorage(): void {
    try {
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (currentUserEmail) {
        this.loadUserProfile(currentUserEmail);
      }
    } catch (error) {
      console.warn('Could not initialize user profile from storage:', error);
    }
  }

  // Get all registered users (for admin purposes)
  getAllUsers(): IUser[] {
    const users: IUser[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userProfile_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const user = JSON.parse(stored);
            users.push(user);
          }
        }
      }
    } catch (error) {
      console.warn('Error getting all users:', error);
    }
    
    return users;
  }

  // Clear current user data (on logout)
  clearCurrentUser(): void {
    this.userProfile.set(null);
    localStorage.removeItem('currentUserEmail');
  }

  setNotesCount(count: number): void {
    this.notesCount.set(count);
  }
}