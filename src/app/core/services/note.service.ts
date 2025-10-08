import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiBaseUrl: string = environment.baseUrl;

  constructor(private _HttpClient: HttpClient) { }

  getNotes(): Observable<any> {
    return this._HttpClient.get(`${this.apiBaseUrl}notes`);
  }

  addNotes(newNote: Note): Observable<any> {
    return this._HttpClient.post(`${this.apiBaseUrl}notes`, newNote);
  }

  updateNote(updatedNote: { title: string; content: string }, noteId: string): Observable<any> {
    return this._HttpClient.put(`${this.apiBaseUrl}notes/${noteId}`, updatedNote);
  }

  deleteNote(noteId: string): Observable<any> {
    return this._HttpClient.delete(`${this.apiBaseUrl}notes/${noteId}`);
  }
}