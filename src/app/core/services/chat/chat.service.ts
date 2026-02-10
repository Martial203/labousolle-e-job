import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ChatHeader, ChatMessage, Attachment } from '../../models/chat/chat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DocumentTemplate } from '../../models/template/document-template';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private _history$: BehaviorSubject<ChatHeader[]> = new BehaviorSubject<ChatHeader[]>([]);
  private _discussion$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  get history$() { return this._history$.asObservable() }
  get discussion$(): Observable<ChatMessage[]> { return this._discussion$.asObservable().pipe(tap(res => console.log(res))) }

  constructor(private http: HttpClient) {}

  getChatHistory(): Observable<ChatHeader[]> {
    return this.http.get<ChatHeader[]>(`${environment.apiUrl}/ai-agent/conversations/`).pipe(
      map((res: any) => this.mapChatHistory(res.results))
    );
  }

  getChatMessages(chatId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`).pipe(
      map((messages: any) => this.mapChatMessages(messages.messages)),
      tap(messages => this._discussion$.next(messages))
    );
  }

  deleteChat(chatId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`);
  }

  sendAMessage(discussionId: string, message: string, file?: File): Observable<ChatMessage>{
    const body: { [ key: string ]: any } = {
      content: message
    }
    const data = new FormData();
    data.append('content', message);
    if(file) data.append('file', file);
    console.log(data);
    this.addMessage({
      chatId: discussionId,
      content: message,
      sender: "user",
      date: new Date()
    })
    return this.http.post<ChatMessage>(`${environment.apiUrl}/ai-agent/conversations/${discussionId}/messages/`, data).pipe(
      tap((res: any) => {
        const message: ChatMessage = {
          chatId: discussionId,
          content: res.content,
          sender: "agent",
          date: new Date(res.timestamp),
          document: res.document ? this.mapDocument(res.document) : undefined
        } 
        this.addMessage(message);
      })
    );
  }

  getLetterTemplates(): Observable<DocumentTemplate[]> {
    const params = new HttpParams();
    params.set('language', 'fr');
    return this.http.get<any[]>(`${environment.apiUrl}/ai-agent/letter-templates/`, { params }).pipe(
      map(documents => this.mapToDocumentTemplate(documents))
    );
  }

  getCVTemplates(): Observable<any[]> {
    const params = new HttpParams();
    params.set('language', 'fr');
    return this.http.get<any[]>(`${environment.apiUrl}/ai-agent/cv-templates/`, { params }).pipe(
      map(documents => this.mapToDocumentTemplate(documents))
    );
  }

  initChat(documentType: 'CV'|'LETTER', templateId: number, job_id?: number): Observable<any> {
    const body = {
      language: "fr",
      document_type: documentType,
      template_id: templateId,
      job_id: job_id
    };
    return this.http.post<any>(`${environment.apiUrl}/ai-agent/conversations/`, body);
  }

  fetchDocument(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'blob' });
  }

  private mapToDocumentTemplate(documents: any[]): DocumentTemplate[]{
    return documents.map(document => ({
      id: document.id,
      category: document.category_display,
      description: document.description,
      language: document.language_display,
      name: document.name,
      previewImage: document.preview_image
    }))
  }

  private mapChatHistory(histories: any[]): ChatHeader[]{
    return histories.map(history => ({
      id: history.session_id,
      date: new Date(history.updated_at),
      language: history.language,
      documentType: history.document_type,
      status: history.status,
      title: history.title ?? history.session_id.toString().split('-')[0]+'-'+history.session_id.toString().split('-')[1]+'-'+history.session_id.toString().split('-')[2]
    }))
  }

  private mapChatMessages(messages: any[]): ChatMessage[]{
    messages = messages.filter(message => message.role !== "system");
    return messages.map(message => ({
      chatId: message.session_id,
      content: message.content,
      sender: message.role==="assistant" ? "agent" : "user",
      date: new Date(message.timestamp),
      document: message.document ? this.mapDocument(message.document) : undefined
    }))
  }

  private addMessage(message: ChatMessage): void{
    const messages = this._discussion$.value;
    messages.push(message)
    this._discussion$.next(messages)
  }

  private mapDocument(document: any): Attachment{
    return {
      id: document.id,
      type: document.type,
      name: document.file_name,
      url: document.download_url
    }
  }

}
