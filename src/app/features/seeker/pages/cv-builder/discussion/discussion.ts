import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Attachment, ChatMessage } from '../../../../../core/models/chat/chat';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { DocumentType } from '../../../../../core/enums/document-type/document-type';
import { base64ToPdfDataUrl, mapObservableError } from '../../../../../core/utils/utils';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { User } from '../../../../../core/models/user/user';
import { Router } from '@angular/router';

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
  @Input() chatId!: string;

  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() turnPreviewMode: EventEmitter<void> = new EventEmitter<void>();
  @Output() optimize: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('pdfViewer') pdfViewer!: any;

  user!: User;
  displayDocumentPreview: boolean = false;
  displayFileNameDialog: boolean = false;
  displayPhoneNumberDialog: boolean = false;
  displayWaitingPaymentDialog: boolean = false;
  pdfSrc!: any;
  docToDownload!:Attachment;
  paymentState: ProcessState = ProcessState.INACTIVE;
  error!: any;

  @Input() msgError: string = '';

  get isPreview(): boolean { 
    console.log(this.messages)
    const val = !this.messages.some(message => message.document && message.document.isPreview === false);
    console.log('val', val)
    if(val) this.turnPreviewMode.emit()
    return val;
  }

  constructor(private authService: AuthService, private chatService: ChatService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.messages)
    this.user = this.authService.user;
  }

  initPayment(phone: string): void{
    this.processState = ProcessState.LOADING;
    this.error = null;
    this.chatService.initPayment(`+237 ${phone}`, this.chatId).subscribe({
      next: (res: any) => {
        if(res.success){
          this.processState = ProcessState.SUCCESS;
          this.paymentState = ProcessState.LOADING;
          this.verifyPayment(res.reference);
        }
      },
      error: (err) => {
        this.processState = ProcessState.ERROR;
        this.error = mapObservableError(err)
      },
      complete: () => this.displayPhoneNumberDialog = false
    })
  }

  verifyPayment(reference: string): void{
    this.paymentState = ProcessState.LOADING;
    this.displayWaitingPaymentDialog = true;
    this.error = null;
    this.chatService.verifyPayment(reference).subscribe({
      next: (res) => {
        if(res === ProcessState.LOADING){
          setTimeout(() => this.verifyPayment(reference), 5000)
        }else if(res === ProcessState.SUCCESS){
          this.paymentState = res;
          this.chatService.getChatMessages(this.chatId).subscribe((res) => this.displayWaitingPaymentDialog = false)
          this.router.navigate(['/cv-builder'], { queryParams: { chatId: this.chatId } })
        }else{
          this.paymentState = res;
          this.displayWaitingPaymentDialog = false;
        }
      },
      error: (err) => {
        alert(mapObservableError(err));
      }
    })
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

  getPaymentUrl(): string{
    let paymentUrl = '';
    for(let i=this.messages.length-1; i>=0; i--){
      if(this.messages[i].paymentUrl){
        paymentUrl = this.messages[i].paymentUrl!
        break;
      }
    }
    return paymentUrl;
  }

  onOptimize(): void{
    const cvOptimizationPrompt: string = `
      Mon CV dépasse une page. Je souhaite que tu le restructures et l’optimises pour qu’il tienne sur une seule page A4.

      Ne te contente pas de réduire le texte :
      - Reformule et synthétise les contenus pour les rendre plus concis et percutants
      - Supprime les redondances et les informations à faible valeur ajoutée
      - Priorise les éléments les plus pertinents selon le poste ciblé
      - Améliore la clarté, la lisibilité et l’impact (phrases courtes, verbes d’action, résultats mesurables si possible)
      - Réorganise les sections si nécessaire pour une meilleure structure

      L’objectif est d’obtenir un CV clair, professionnel, dense et efficace, tenant sur une seule page A4, sans perte d’informations essentielles ni de valeur.
      `;
    this.optimize.emit(cvOptimizationPrompt);
  }

  onApply(): void {
    this.apply.emit();
  }
}
