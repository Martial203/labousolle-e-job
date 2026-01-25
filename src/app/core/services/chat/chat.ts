import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatHeader, ChatMessage } from '../../models/chat/chat';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Chat {
  
  private _history$: BehaviorSubject<ChatHeader[]> = new BehaviorSubject<ChatHeader[]>([]);
  get history$() { return this._history$.asObservable() }

  constructor(private http: HttpClient) {}

  getChatHistory(): Observable<ChatHeader[]> {
    return this.http.get<ChatHeader[]>(`${environment.apiUrl}/ai-agent/conversations/`);
  }

  getChatMessages(chatId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`);
  }

  deleteChat(chatId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`);
  }

  sendAMessage(): Observable<ChatMessage>{
    const body = {
      content: '',
      file: ''
    }
    return this.http.post<ChatMessage>(`${environment.apiUrl}/ai-agent/conversations/`, body);
  }

  getLetterTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ai-agent/letter-templates/`);
  }
}
