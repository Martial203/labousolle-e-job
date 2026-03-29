import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { ChatHeader, ChatMessage, Attachment } from '../../models/chat/chat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DocumentTemplate } from '../../models/template/document-template';
import { Cacheable } from 'ts-cacheable';
import { DocumentType } from '../../enums/document-type/document-type';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  private _history$: BehaviorSubject<ChatHeader[]> = new BehaviorSubject<ChatHeader[]>([]);
  private _discussion$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private _cvTemplates: DocumentTemplate[] = [];

  get history$() { return this._history$.asObservable().pipe(map(chats => chats.sort((a, b) => b.date.getTime() - a.date.getTime()))) }
  get discussion$(): Observable<ChatMessage[]> { return this._discussion$.asObservable() }

  private readonly LAST_CHAT_ID = 'last-chat-id';

  constructor(private http: HttpClient) {
    this.getChatHistory().subscribe(res => this._history$.next(res));
  }

  private getLastChatId(): string{
    return sessionStorage.getItem(this.LAST_CHAT_ID) ?? "";
  }

  getChatHeaderSnapshot(id: string): ChatHeader|undefined{
    return this._history$.value.find(chat => chat.id === id)
  }

  migrateChatSession(): Observable<string>|null{
    const lastChatId = this.getLastChatId();
    if(lastChatId.length>0){
      const body = { session_id: lastChatId }
      return this.http.post<any>(`${environment.apiUrl}/ai-agent/conversations/migrate/`, body).pipe(
        map(res => res.session_id),
        tap(() => sessionStorage.removeItem(this.LAST_CHAT_ID)),
      );
    }
    return null;
  }

  getChatHistory(): Observable<ChatHeader[]> {
    return this.http.get<ChatHeader[]>(`${environment.apiUrl}/ai-agent/conversations/`).pipe(
      map((res: any) => this.mapChatHistory(res.results))
    );
  }

  getChatMessages(chatId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`).pipe(
      map((messages: any) => this.mapChatMessages(messages.messages)),
      tap(messages => {
        this._discussion$.next(messages);
        this.setLastDiscussionId(chatId);
      })
    );
  }

  deleteChat(chatId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`);
  }

  sendAMessage(discussionId: string, message: string, oldCV?: File|null, profile?: File|null): Observable<ChatMessage>{
    const data = new FormData();
    data.append('content', message);
    if(oldCV) {
      data.append('old_cvfile', oldCV);
    }
    if(profile){
      data.append('profile', profile);
    }
    console.log(message)
    let additionnalMessage = ''
    if(oldCV) additionnalMessage = 
    `
      <div class="flex flex-col gap-2 py-3 rounded-lg bg-gray-50 mt-4 italic">
        <p class="text-sm font-medium text-gray-700"> <span class="font-bold">Fichier joint:</span> ${oldCV.name}</p>
      </div>`
    // '\n\n📎 [Fichier joint: '+file.name+']';
    this.addMessage({
      chatId: discussionId,
      content: `${message} ${additionnalMessage}`,
      sender: "user",
      date: new Date()
    })
    return this.http.post<ChatMessage>(`${environment.apiUrl}/ai-agent/conversations/${discussionId}/messages/`, data).pipe(
      map((res: any) => {
        const message: ChatMessage = {
          chatId: discussionId,
          // content: !res.payment_required ? res.content : this.buildPaymentMessage(res.payment_url ?? ''),
          content: res.content,
          sender: "agent",
          paymentUrl: res.payment_required ? res.payment_url : undefined,
          date: new Date(res.timestamp),
          document: res.document ? this.mapDocument(res.document) : undefined
        }
        return message;
      }),
      tap(message => { 
        this.addMessage(message);
        if(message.document && !message.document?.isPreview){
          const mess: ChatMessage = {
            chatId: message.chatId,
            content: 'Si tu désires également un lettre de motivation, fais le moi savoir dans ton prochain message.',
            date: new Date(),
            sender: "agent"   
          }
          this.addMessage(mess);
        }
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
      map(documents => this.mapToDocumentTemplate(documents)),
      tap(res => this._cvTemplates = res)
    );
  }

  initChat(documentType: 'CV'|'LETTER', templateId: string, jobId?: number): Observable<ChatHeader> {
    const body: { [key: string]: string|number } = {
      language: "fr",
      document_type: documentType,
      template_id: templateId
    };
    if(jobId) body['job_id'] = jobId;
    return this.http.post<any>(`${environment.apiUrl}/ai-agent/conversations/`, body).pipe(
      map(res => this.mapChatHistory([res])[0]),
      tap(chat => {
        sessionStorage.setItem(this.LAST_CHAT_ID, chat.id);
        this._history$.next([...this._history$.value, chat]);
        this._discussion$.next([])
      })
    );
  }

  initCVAudit(file: File, jobId?: number): Observable<ChatMessage> {
    return this.initChat(DocumentType.CV, this._cvTemplates[0].id, jobId).pipe(
      switchMap(chat => this.sendAMessage(chat.id, jobId ? "Fais moi un audit de ce CV pour l'offre d'emploi sélectionnée et optimisons le ensemble." : "Fais moi stp un audit de ce CV et optimisons le ensemble.", file))
    )
  }

  changeTemplate(chatId: string, templateId: string): Observable<void>{
    const body = {
      template_id: templateId
    }
    return this.http.patch<any>(`${environment.apiUrl}/ai-agent/conversations/${chatId}/`, body)
  }

  fetchDocument(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getLastDiscussionId(): string{
    return localStorage.getItem('last-chat') ?? '';
  }

  private setLastDiscussionId(chatId: string): void{
    localStorage.setItem('last-chat', chatId);
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
      title: history.title ?? history.session_id.toString().split('-')[0]+'-'+history.session_id.toString().split('-')[1]+'-'+history.session_id.toString().split('-')[2],
      jobId: history.job_id ?? undefined
    }))
  }

  private mapChatMessages(messages: any[]): ChatMessage[]{
    messages = messages.filter(message => message.role !== "system");
    return messages.map(message => ({
      chatId: message.session_id,
      // content: !message.payment_required ? message.content : this.buildPaymentMessage(message.payment_url ?? ''),
      content: message.content,
      paymentUrl: message.payment_required ? message.payment_url : undefined,
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
      url: document.download_url ?? document.pdf_base64,
      isPreview: document.is_preview ?? true
    }
  }

  private buildPaymentMessage(paymentUrl: string): string{
    return `
      <div class="ai-message payment max-w-[280px] my-3 rounded-2xl 
                  border border-blue-100 bg-white shadow-sm">

        <div class="p-4 space-y-3">

          <p class="text-sm text-gray-800 font-medium">
            ✅ Votre document est prêt !
          </p>

          <p class="text-sm text-gray-600">
            Pour le recevoir, un paiement de 
            <span class="font-semibold text-blue-600">500 XAF</span> est requis.
          </p>

          <a 
            id="payment"
            href="${paymentUrl}" 
            target="_self"
            class="block w-full text-center px-4 py-2.5 
                  rounded-xl text-sm font-semibold 
                  text-white bg-blue-600 
                  hover:bg-blue-700 
                  transition-colors duration-200"
          >
            💳 Payer 500 XAF
          </a>

          <p class="text-xs text-gray-400 text-center">
            Après le paiement, votre document sera automatiquement envoyé dans cette conversation.
          </p>

        </div>
      </div>
    `;
  }

}
