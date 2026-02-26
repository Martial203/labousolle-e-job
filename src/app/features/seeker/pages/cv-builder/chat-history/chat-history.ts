import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatGroupedByPeriod, ChatHeader } from '../../../../../core/models/chat/chat';
import { DocumentType } from '../../../../../core/enums/document-type/document-type';

@Component({
  selector: 'app-chat-history',
  standalone: false,
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {

  @Input() chatHistory!: ChatGroupedByPeriod;

  @Output() newChat: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeTemplate: EventEmitter<{ chatId: string, documentType: DocumentType }> = new EventEmitter<{ chatId: string, documentType: DocumentType }>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
  @Output() select: EventEmitter<string> = new EventEmitter<string>();

  selectedChat!: string;

  onInit(): void{
    this.newChat.emit();
  }

  onSelect(id: string): void{
    this.selectedChat = id;
    this.select.emit(id);
  }

  onChangeTemplate(chatId: string, documentType: DocumentType): void{
    this.changeTemplate.emit({ chatId, documentType });
  }

  onDelete(id: string): void{
    this.delete.emit(id);
  }

}
