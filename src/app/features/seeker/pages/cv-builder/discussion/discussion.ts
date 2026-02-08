import { Component, Input, ViewChild } from '@angular/core';
import { ChatMessage } from '../../../../../core/models/chat/chat';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';

@Component({
  selector: 'app-discussion',
  standalone: false,
  templateUrl: './discussion.html',
  styleUrl: './discussion.scss',
})
export class Discussion {

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;

  @Input() messages!: ChatMessage[]
  @Input() typingState: ProcessState = ProcessState.INACTIVE;
  @ViewChild('pdfViewer') pdfViewer!: any;

  displayDocumentPreview: boolean = false;
  pdfSrc!: any;

  constructor(private chatService: ChatService) { }

  download(url: string): void {
    this.chatService.fetchDocument(url).subscribe({
      next: (res: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(res);
        link.download = 'document';
        link.click();
        this.processState = ProcessState.SUCCESS;
      },
      error: (err) => {
        this.processState = ProcessState.ERROR;
        console.error(err);
      }
    });
  }

  previewDocument(url: string): void {
    this.processState = ProcessState.LOADING;
    this.displayDocumentPreview = true;
    this.chatService.fetchDocument(url).subscribe({
      next: (res: any) => {
        this.processState = ProcessState.SUCCESS;
        const src = window.URL.createObjectURL(res);
        this.pdfSrc = src;
      },
      error: (err) => {
        this.processState = ProcessState.ERROR;
        console.error(err);
      }
    });
  }
}
