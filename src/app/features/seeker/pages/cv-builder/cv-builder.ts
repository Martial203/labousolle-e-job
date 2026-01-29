import { Component } from '@angular/core';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatHeader } from '../../../../core/models/chat/chat';
import { DocumentType } from '../../../../core/enums/document-type/document-type';

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
 
  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.documentType = params['document'];
    })
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
