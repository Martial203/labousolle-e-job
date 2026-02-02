import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatGroupedByPeriod, ChatHeader, ChatMessage } from '../../../../core/models/chat/chat';
import { DocumentType } from '../../../../core/enums/document-type/document-type';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { User } from '../../../../core/models/user/user';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-cv-builder',
  standalone: false,
  templateUrl: './cv-builder.html',
  styleUrl: './cv-builder.scss',
})
export class CvBuilder {
  displayTemplatePicker: boolean = false;
  chatHistory$!: Observable<ChatHeader[]>;
  documentType!: DocumentType;
  discussion$!: Observable<ChatMessage[]>;

  selectedDiscussion!: string;
  messageProcessing: ProcessState = ProcessState.INACTIVE;

  user!: User;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  constructor(private chatService: ChatService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.documentType = params['document'];
    });
    this.chatHistory$ = this.chatService.getChatHistory();
    this.user = this.authService.user;
    this.discussion$ = this.chatService.discussion$;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  deleteChat(id: string): void {
    this.chatService.deleteChat(id);
  }

  selectChat(id: string): void {
    this.chatService.getChatMessages(id).subscribe();
    this.selectedDiscussion = id;
  }

  sendMessage(message: string): void{
    this.messageProcessing = ProcessState.LOADING;
    this.scrollToBottom()
    this.chatService.sendAMessage(this.selectedDiscussion, message).subscribe({
      next: () => this.messageProcessing = ProcessState.SUCCESS,
      error: (err) => this.messageProcessing = ProcessState.ERROR,
      complete: () => this.scrollToBottom()
    });
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

  private scrollToBottom(): void {
    if (!this.scrollContainer) return;
    setTimeout(() => {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }
}
