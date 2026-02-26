import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { DocumentType } from '../../../../../core/enums/document-type/document-type';
import { DocumentTemplate } from '../../../../../core/models/template/document-template';
import { Observable, tap } from 'rxjs';

interface Template {
  type: DocumentType;
  templateId: number;
  createdDiscussionId: string;
}

@Component({
  selector: 'app-template-picker',
  standalone: false,
  templateUrl: './template-picker.html',
  styleUrl: './template-picker.scss',
})
export class TemplatePicker {

  @Input() jobId!: number|undefined;
  @Input() selectedType: DocumentType = DocumentType.CV;
  @Input() change!: DocumentType;
  @Input() chatId!: string;

  @Output() result: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  selectedTemplate: any;

  readonly DOCUMENT_TYPES = DocumentType;

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;

  cvTemplates$!: Observable<DocumentTemplate[]>;
  documents$!: Observable<DocumentTemplate[]>;

  cvLoading: boolean = true;
  letterLoading: boolean = true;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.cvTemplates$ = this.chatService.getCVTemplates().pipe(tap(() => this.cvLoading = false));
    this.documents$ = this.chatService.getLetterTemplates().pipe(tap(() => this.letterLoading = false));
    this.selectedType = this.change ?? DocumentType.CV;
  }

  selectTemplate(template: any) {
    this.selectedTemplate = template;
  }
  
  getTemplates(): Observable<DocumentTemplate[]>{
    return this.selectedType === DocumentType.CV ? this.cvTemplates$ : this.documents$;
  }

  onSubmit() {
    if(this.selectedTemplate) {
      this.processState = ProcessState.LOADING;
      if(this.chatId){
        this.chatService.changeTemplate(this.chatId, this.selectedTemplate.id).subscribe({
          next: () => {
            this.processState = ProcessState.SUCCESS;
            setTimeout(() => this.result.emit(), 2000);
          },
          error: (err) => {
            this.processState = ProcessState.ERROR;
          }
        })
      }else{
        this.chatService.initChat(this.selectedType, this.selectedTemplate.id, this.jobId).subscribe({
          next: (res) => {
            this.processState = ProcessState.SUCCESS;
            setTimeout(() => this.result.emit(res.id), 2000);
          },
          error: (err) => {
            this.processState = ProcessState.ERROR;
          }
        })
      }
    }
  }

  onCancel(): void{
    this.cancel.emit();
  }

}
