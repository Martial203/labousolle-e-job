import { Component, EventEmitter, Output } from '@angular/core';
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
  attachment!: File;

  @Output() message: EventEmitter<MessageInput> = new EventEmitter<MessageInput>();

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
    console.log(message);
    this.message.emit(message);
    this.text = '';
    this.attachment = null!;
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
    this.attachment = files[0]
    console.log(this.attachment);
  }
}
