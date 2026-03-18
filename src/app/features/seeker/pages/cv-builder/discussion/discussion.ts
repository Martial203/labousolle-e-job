import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Attachment, ChatMessage } from '../../../../../core/models/chat/chat';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { DocumentType } from '../../../../../core/enums/document-type/document-type';
import { base64ToPdfDataUrl } from '../../../../../core/utils/utils';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { User } from '../../../../../core/models/user/user';

@Component({
  selector: 'app-discussion',
  standalone: false,
  templateUrl: './discussion.html',
  styleUrl: './discussion.scss',
})
export class Discussion {

  readonly PROCESS_STATES = ProcessState;
  readonly DOCUMENT_TYPES = DocumentType;
  processState: ProcessState = ProcessState.INACTIVE;

  @Input() messages!: ChatMessage[]
  @Input() typingState: ProcessState = ProcessState.INACTIVE;
  @Input() documentType!: DocumentType;
  @Input() loadingMessages: boolean = false;
  @Input() jobSelected: boolean = false;

  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() turnPreviewMode: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('pdfViewer') pdfViewer!: any;

  user!: User;
  displayDocumentPreview: boolean = false;
  displayFileNameDialog: boolean = false;
  pdfSrc!: any;
  docToDownload!:Attachment;

  get isPreview(): boolean { 
    const val = this.messages.filter(message => message.document ? message.document.isPreview : false).length>0;
    if(val) this.turnPreviewMode.emit()
    return val;  
  }

  constructor(private authService: AuthService, private chatService: ChatService) { }

  ngOnInit(): void {
    console.log(this.messages)
    this.user = this.authService.user;
  }

  download(fileName: string): void {
    if(this.docToDownload == null) return;
    this.processState = ProcessState.LOADING;
    this.chatService.fetchDocument(this.docToDownload.url).subscribe({
      next: (res: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(res);
        link.download = fileName;
        link.click();
        this.processState = ProcessState.SUCCESS;
      },
      error: (err) => {
        this.processState = ProcessState.ERROR;
        // alert(mapObservableError(err))
        console.error(err);
      },
      complete: () => this.displayFileNameDialog = false
    });
  }

  buildFileName(): string{
    if(this.docToDownload == null) return '';
    if(this.user == null || this.user == undefined) return this.docToDownload.name;
    return `${this.docToDownload.type === DocumentType.CV ? 'CV' : 'LETTER'}_${this.user.firstName+' '+this.user.name}_${new Date().toLocaleDateString()}`;
  }

  onInitDownload(attachment: Attachment): void{
    this.docToDownload = attachment;
    this.displayFileNameDialog = true;
  }

  previewDocument(url: string): void {
    this.processState = ProcessState.LOADING;
    this.displayDocumentPreview = true;
    if(url.startsWith('http://') || url.startsWith('https://')){
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
    }else{
      this.processState = ProcessState.SUCCESS;
      this.pdfSrc = base64ToPdfDataUrl(url);
    }
  }

  onApply(): void {
    this.apply.emit();
  }
}
