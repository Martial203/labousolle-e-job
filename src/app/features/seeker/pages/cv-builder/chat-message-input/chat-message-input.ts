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

  profileAttachment!: File|null;
  profileAttachmentPreview!: any;
  lastProfileFile!: File|null;

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
    if(this.profileAttachment) this.lastProfileFile = this.profileAttachment;
    const message : MessageInput = {
      content: this.text,
      oldCV: this.profileAttachment ?? undefined,
      profile: this.profileAttachment ?? undefined
    }
    this.message.emit(message);
    this.text = '';
    this.attachment = null!;
    this.profileAttachment = null!;
    this.attachmentPreview = null!;
    this.profileAttachmentPreview = null!;
  }

  stop() {
    this.recognition.stop();
  }

  startSpeech() {
    this.requestMicPermission().then(() => this.start(t => this.text = t));
  }

  stopSpeech() {
    this.stop();
  }

  uploadAttachment(event: any, type: 'cv'|'profile'): void{
    const files = event.target.files;
    if(files.length===0) return;
    if(type==='cv'){
      this.attachment = files[0];
      this.attachmentPreview = URL.createObjectURL(this.attachment!);
      this.uploadedFile.emit(this.attachment!);
    }else{
      this.profileAttachment = files[0];
      this.profileAttachmentPreview = URL.createObjectURL(this.profileAttachment!);
      this.uploadedFile.emit(this.attachment!);
    }
  }

  onRemoveAttachment(type: 'cv'|'profile'): void{
    if(type==='cv'){
      this.attachment = null;
      this.attachmentPreview = null;
    }else{
      this.profileAttachment = null;
      this.profileAttachmentPreview = null;
    }
  }

  async requestMicPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Permission accordée");
    } catch (err) {
      console.log("Permission refusée", err);
    }
  }
}
