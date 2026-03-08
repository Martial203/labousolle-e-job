import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ChatGroupedByPeriod, ChatHeader, ChatMessage } from '../../../../core/models/chat/chat';
import { DocumentType } from '../../../../core/enums/document-type/document-type';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { User } from '../../../../core/models/user/user';
import { MessageInput } from '../../../../core/models/chat/chat';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { JobService } from '../../../../core/services/job/job.service';

@Component({
  selector: 'app-cv-builder',
  standalone: false,
  templateUrl: './cv-builder.html',
  styleUrl: './cv-builder.scss',
})
export class CvBuilder {
  displayTemplatePicker: boolean = false;
  displayTestimonialDialog: boolean = false;
  displayCvUploadDialog: boolean = false;
  displayChatHistory: boolean = false;
  chatHistory$!: Observable<ChatHeader[]>;
  documentType!: DocumentType;
  discussion$!: Observable<ChatMessage[]>;

  jobId!: number;
  jobDetails!: { title: string, company: string };

  selectedDiscussion!: string;
  messageProcessing: ProcessState = ProcessState.INACTIVE;

  user!: User;

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;

  readonly DOCUMENT_TYPES = DocumentType;

  loadingApplication: boolean = false;
  loadingAudit: boolean = false;
  isChatSelected: boolean = false;

  chatId!: string;
  toChangeDocumentType!: DocumentType;

  tmpUploadedCvToAudit!: File|null;
  tmpUploadedCvToPreview!: any;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  constructor(private chatService: ChatService, private jobService: JobService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.documentType = params['document'] ?? DocumentType.CV;
      this.jobDetails = { title: params['title'], company: params['company'] }
      const chatId = params['chatId'];
      this.selectChat(chatId);
    });
    this.chatHistory$ = this.chatService.history$;
    this.user = this.authService.user;
    this.discussion$ = this.chatService.discussion$;
    const jobId = this.route.snapshot.params['jobId'];
    if(jobId) this.jobId = +jobId;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  onToggleChatHistory(): void{
    this.displayChatHistory = !this.displayChatHistory;
  }

  onSetChangeTemplateMode(value: { chatId: string, documentType: DocumentType }): void{
    this.chatId = value.chatId;
    this.toChangeDocumentType = value.documentType;
    this.displayTemplatePicker = true;
  }

  onNewChat(): void{
    this.displayTemplatePicker = true;
    this.onClearChangeSelection();
  }

  onClearChangeSelection(): void{
    console.log('Hided')
    this.chatId = undefined!;
    this.toChangeDocumentType = undefined!;
  }

  deleteChat(id: string): void {
    this.chatService.deleteChat(id);
  }

  selectChat(id: string): void {
    if(id===undefined || id===null || this.selectedDiscussion===id) return;
    this.processState = ProcessState.LOADING;
    this.chatService.getChatMessages(id).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        this.isChatSelected = true;
      },
      error: () => this.processState = ProcessState.ERROR,
      complete: () => this.scrollToBottom()
    });
    this.selectedDiscussion = id;
    this.onClearChangeSelection();
  }

  sendMessage(message: MessageInput): void{
    this.messageProcessing = ProcessState.LOADING;
    this.scrollToBottom();
    this.chatService.sendAMessage(this.selectedDiscussion, message.content, message.file ? message.file : undefined).subscribe({
      next: () => this.messageProcessing = ProcessState.SUCCESS,
      error: (err) => this.messageProcessing = ProcessState.ERROR,
      complete: () => this.scrollToBottom()
    });
  }

  onDiscussionCreated(discussionId: string): void{
    this.displayTemplatePicker = false;
    this.selectChat(discussionId);
  }

  groupChatsByDate(chats: ChatHeader[]): ChatGroupedByPeriod {
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const grouped: ChatGroupedByPeriod = {
      today: [],
      lastWeek: [],
      lastMonth: [],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.date);

      if (chatDate >= startOfToday) {
        grouped.today.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        grouped.lastWeek.push(chat);
      } else if (chatDate >= thirtyDaysAgo) {
        grouped.lastMonth.push(chat);
      }
    });

    return grouped;
  }

  onUploadCV(event: any): void{
    this.tmpUploadedCvToAudit = event.target.files[0];
    this.tmpUploadedCvToPreview = URL.createObjectURL(this.tmpUploadedCvToAudit!);
  }

  initCvAudit(): void{
    this.loadingAudit = true;
    if(this.tmpUploadedCvToAudit === undefined) return;
    this.chatService.initCVAudit(this.tmpUploadedCvToAudit!, this.jobId).subscribe({
      next: (res) => {
        this.tmpUploadedCvToAudit = null;
        this.tmpUploadedCvToPreview = null;
        this.displayCvUploadDialog = false;
        console.log(res)
        this.selectChat(res.chatId);
        console.log(this.selectedDiscussion)
      },
      error: err => alert(err),
      complete: () => this.loadingAudit = false
    })
  }

  onApply(): void{
    if(this.jobId==null) return;
    this.loadingApplication = true;
    this.jobService.applyToJob(this.jobId).subscribe({
      next: () => setTimeout(() => this.displayTestimonialDialog = true, 10000),
      error: () => alert('Une erreur est survenue, veuillez ressayer'),
      complete: () => this.loadingApplication = false
    });
  }

  isCreatedDocument(messages: ChatMessage[]): boolean{
    for(let message of messages){
      if(message.document){
        return true;
      }
    }
    return false;
  }

  private scrollToBottom(): void {
    if (!this.scrollContainer) return;
    setTimeout(() => {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
