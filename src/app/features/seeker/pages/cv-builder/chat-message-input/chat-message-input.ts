import { Component, EventEmitter, Output } from '@angular/core';

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

  @Output() message: EventEmitter<string> = new EventEmitter<string>();

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
    this.message.emit(this.text);
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
}
