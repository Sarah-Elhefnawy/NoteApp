import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoteService } from '../../core/services/note.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Note } from '../../core/interfaces/note.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class HomeComponent implements OnInit {
  private readonly _NoteService = inject(NoteService);
  private _AuthService = inject(AuthService);

  notes = signal<Note[]>([]);
  showAddDialog = signal(false);
  showDeleteConfirm = signal(false);
  isEditMode = signal(false);
  isLoading = signal(true);

  noteToDelete: string | null = null;
  editingNote: Note | null = null;

  noteForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    content: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  ngOnInit() {
    setTimeout(() => {
      this.getAllNotes();
    }, 100);
  }

  // GET Notes
  getAllNotes() {
    // Check if user is authenticated first
    const token = this._AuthService.userToken.getValue();
    if (!token) {
      console.log('No token available, skipping notes fetch');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this._NoteService.getNotes().subscribe({
      next: (response) => {
        console.log('Notes loaded successfully:', response);
        this.notes.set(response.notes || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading.set(false);

        // If token is invalid, redirect to login
        if (error.status === 404 && error.error.msg === 'token not found') {
          this._AuthService.logOut();
        }
      }
    });
  }

  // ADD Note
  addNote() {
    if (this.noteForm.valid) {
      this._NoteService.addNotes(this.noteForm.value).subscribe({
        next: (response) => {
          // console.log('Note added:', response);
          this.getAllNotes();
          this.closeAddNoteDialog();
        },
        error: (error) => {
          console.error('Error adding note:', error);
        }
      });
    }
  }

  openAddNoteDialog() {
    this.showAddDialog.set(true);
  }

  closeAddNoteDialog() {
    this.showAddDialog.set(false);
    this.noteForm.reset();
  }

  // EDIT Note
  openEditDialog(note: Note) {
    this.editingNote = note;
    this.isEditMode.set(true);
    this.noteForm.patchValue({
      title: note.title,
      content: note.content
    });
  }

  saveEdit() {
    if (this.noteForm.valid && this.editingNote) {
      this._NoteService.updateNote(this.noteForm.value, this.editingNote._id).subscribe({
        next: (response) => {
          // console.log('Note updated successfully:', response);
          this.getAllNotes();
          this.closeEditDialog();
        },
        error: (error) => {
          console.error('Error updating note:', error);
        }
      });
    }
  }

  closeEditDialog() {
    this.isEditMode.set(false);
    this.editingNote = null;
    this.noteForm.reset();
  }

  // DELETE Note
  deleteNote(noteId: string) {
    this.noteToDelete = noteId;
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    if (this.noteToDelete) {
      this._NoteService.deleteNote(this.noteToDelete).subscribe({
        next: (response) => {
          // console.log('Note deleted successfully:', response);
          this.getAllNotes();
          this.closeDeleteConfirm();
        },
        error: (error) => {
          console.error('Error deleting note:', error);
          this.closeDeleteConfirm();
        }
      });
    }
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.noteToDelete = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
}