import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatGroupedByPeriod, ChatHeader } from '../../../../../core/models/chat/chat';

@Component({
  selector: 'app-chat-history',
  standalone: false,
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {

  @Input() chatHistory!: ChatGroupedByPeriod;

  @Output() newChat: EventEmitter<void> = new EventEmitter<void>();
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

  onDelete(id: string): void{
    this.delete.emit(id);
  }

}
