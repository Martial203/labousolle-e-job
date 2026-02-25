import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ChatHeader, ChatMessage, Attachment } from '../../models/chat/chat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DocumentTemplate } from '../../models/template/document-template';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private _history$: BehaviorSubject<ChatHeader[]> = new BehaviorSubject<ChatHeader[]>([]);
  private _discussion$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  get history$() { return this._history$.asObservable().pipe(map(chats => chats.sort((a, b) => b.date.getTime() - a.date.getTime()))) }
  get discussion$(): Observable<ChatMessage[]> { return this._discussion$.asObservable().pipe(
    // map(res => res.sort((a, b) => a.date.getTime() - b.date.getTime())),
    tap(res => console.log('discussion updated:', res))
  ) }

  constructor(private http: HttpClient) {
    this.getChatHistory().subscribe(res => this._history$.next(res));
  }

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

        const paymentMessage = `
          <div class="ai-message payment max-w-[280px] sm:max-w-xs my-2 rounded-2xl overflow-hidden border border-indigo-100 bg-white shadow-md">
            <div class="bg-indigo-50 px-4 py-2 flex items-center border-b border-indigo-100">
              <span class="text-indigo-600 text-sm italic">✨ Document prêt</span>
            </div>

            <div class="p-4">
              <p class="text-gray-700 text-[13px] leading-snug mb-3">
                Votre CV est finalisé ! Pour le télécharger, un petit café de <span class="font-bold text-indigo-600">500 XAF</span> est demandé.
              </p>
              
              <a href="${res.payment_url ?? ''}" 
                target="_self" 
                class="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm">
                💳 Payer & Télécharger
              </a>
              
              <div class="mt-2 flex items-center justify-center space-x-1 opacity-60">
                <svg class="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-[10px] text-gray-500">Paiement sécurisé via NotchPay</span>
              </div>
            </div>
          </div>
          `;

        const message: ChatMessage = {
          chatId: discussionId,
          content: !res.payment_required ? res.content : paymentMessage,
          sender: "agent",
          date: new Date(res.timestamp),
          document: res.document ? this.mapDocument(res.document) : undefined
        } 
        this.addMessage(message);
      })
    );
  }

  @Cacheable({ maxAge: 60 * 60 * 1000 })
  getLetterTemplates(): Observable<DocumentTemplate[]> {
    const params = new HttpParams();
    params.set('language', 'fr');
    return this.http.get<any[]>(`${environment.apiUrl}/ai-agent/letter-templates/`, { params }).pipe(
      map(documents => this.mapToDocumentTemplate(documents))
    );
  }

  @Cacheable({ maxAge: 60 * 60 * 1000 })
  getCVTemplates(): Observable<DocumentTemplate[]> {
    const params = new HttpParams();
    params.set('language', 'fr');
    return this.http.get<any[]>(`${environment.apiUrl}/ai-agent/cv-templates/`, { params }).pipe(
      map(documents => this.mapToDocumentTemplate(documents))
    );
  }

  initChat(documentType: 'CV'|'LETTER', templateId: number, jobId?: number): Observable<ChatHeader> {
    const body: { [key: string]: string|number } = {
      language: "fr",
      document_type: documentType,
      template_id: templateId
    };
    if(jobId) body['job_id'] = jobId;
    return this.http.post<any>(`${environment.apiUrl}/ai-agent/conversations/`, body).pipe(
      map(res => this.mapChatHistory([res])[0]),
      tap(chat => {
        this._history$.next([...this._history$.value, chat]);
        this._discussion$.next([])
      })
    );
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
      date: history.updated_at ? new Date(history.updated_at) : new Date(),
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
