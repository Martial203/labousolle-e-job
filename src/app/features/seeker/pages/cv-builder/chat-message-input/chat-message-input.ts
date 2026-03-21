import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageInput } from '../../../../../core/models/chat/chat';

@Component({
  selector: 'app-chat-message-input',
  standalone: false,
  templateUrl: './chat-message-input.html',
  styleUrl: './chat-message-input.scss',
})
export class ChatMessageInput {
  private recognition: any;
  text = '';
  visible: boolean = false;
  attachment!: File|null;
  attachmentPreview!: any;

  @Input() minLength: number = 1;
  @Input() isChatSelected: boolean = false;
  @Input() disabled: boolean = false;
  @Output() message: EventEmitter<MessageInput> = new EventEmitter<MessageInput>();
  @Output() uploadedFile: EventEmitter<File> = new EventEmitter<File>();

  isOpen: boolean = true;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

  start(onResult: (text: string) => void) {
    this.recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };
    this.recognition.start();
  }

  onSend(): void{
    const message : MessageInput = {
      content: this.text,
      file: this.attachment ? this.attachment : undefined
    }
    this.message.emit(message);
    this.text = '';
    this.attachment = null!;
    this.attachmentPreview = null;
  }

  stop() {
    this.recognition.stop();
  }

  startSpeech() {
    this.start(t => this.text = t);
  }

  stopSpeech() {
    this.stop();
  }

  uploadAttachment(event: any): void{
    const files = event.target.files;
    if(files.length===0) return;
    this.attachment = files[0];
    this.attachmentPreview = URL.createObjectURL(this.attachment!);
    this.uploadedFile.emit(this.attachment!);
  }

  onRemoveAttachment(): void{
    this.attachment = null;
    this.attachmentPreview = null;
  }
}
