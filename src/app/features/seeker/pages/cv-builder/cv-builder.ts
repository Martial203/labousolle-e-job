import { Component } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatHeader } from '../../../../core/models/chat/chat';

@Component({
  selector: 'app-cv-builder',
  standalone: false,
  templateUrl: './cv-builder.html',
  styleUrl: './cv-builder.scss',
})
export class CvBuilder {

  displayTemplatePicker: boolean = false;
  chatHistory$!: Observable<ChatHeader[]>;
 
  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.chatHistory$ = this.chatService.getChatHistory();
  }

  initChat(): void{
    this.displayTemplatePicker = false;
  }

  deleteChat(id: number): void{
    this.chatService.deleteChat(id);
  }

  selectChat(id: number): void{
    this.chatService.getChatMessages(id);
  }

}
