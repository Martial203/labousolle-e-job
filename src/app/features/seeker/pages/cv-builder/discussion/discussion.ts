import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Attachment, ChatMessage } from '../../../../../core/models/chat/chat';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { DocumentType } from '../../../../../core/enums/document-type/document-type';

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
  @Input() documentType!: DocumentType;
  @Input() loadingMessages: boolean = false;
  @Input() jobSelected: boolean = false;

  @Output() apply: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('pdfViewer') pdfViewer!: any;

  displayDocumentPreview: boolean = false;
  pdfSrc!: any;

  get isPreview(): boolean { return this.messages.filter(message => message.document ? message.document.isPreview : false).length>0 }

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    console.log(this.messages)
  }

  download(doc: Attachment): void {
    this.processState = ProcessState.LOADING;
    this.chatService.fetchDocument(doc.url).subscribe({
      next: (res: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(res);
        link.download
        link.click();
        this.processState = ProcessState.SUCCESS;
      },
      error: (err) => {
        this.processState = ProcessState.ERROR;
        // alert(mapObservableError(err))
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
        // alert(mapObservableError(err))
        console.error(err);
      }
    });
  }

  onApply(): void {
    this.apply.emit();
  }
}
