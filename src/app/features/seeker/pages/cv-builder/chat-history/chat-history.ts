import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-history',
  standalone: false,
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {

  @Output() newChat: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
  @Output() select: EventEmitter<number> = new EventEmitter<number>();

  onInit(): void{
    this.newChat.emit();
  }

  onSelect(id: number): void{
    this.select.emit(id);
  }

  onDelete(id: number): void{
    this.delete.emit(id);
  }

}
