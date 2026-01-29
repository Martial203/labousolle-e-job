import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { DocumentType } from '../../../../../core/enums/document-type/document-type';

interface Template {
  type: DocumentType;
  templateId: number;
}

@Component({
  selector: 'app-template-picker',
  standalone: false,
  templateUrl: './template-picker.html',
  styleUrl: './template-picker.scss',
})
export class TemplatePicker {

  @Input() jobId!: number|undefined;
  @Output() result: EventEmitter<Template> = new EventEmitter<Template>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  selectedType: DocumentType = DocumentType.CV;
  selectedTemplate: any;

  readonly DOCUMENT_TYPES = DocumentType;

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;
  

  templates = {
    CV: [
      { id: 1, name: 'Modern', description: 'Clean and contemporary design', preview: '/assets/templates/cv-modern.jpg' },
      { id: 2, name: 'Classic', description: 'Traditional professional layout', preview: '/assets/templates/cv-classic.jpg' },
      { id: 3, name: 'Creative', description: 'Stand out with creative flair', preview: '/assets/templates/cv-creative.jpg' },
    ],
    LETTER: [
      { id: 1, name: 'Formal', description: 'Professional formal letter', preview: '/assets/templates/letter-formal.jpg' },
      { id: 2, name: 'Friendly', description: 'Warm and personable tone', preview: '/assets/templates/letter-friendly.jpg' },
    ]
  };

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getLetterTemplates().subscribe();
    this.chatService.getCVTemplates().subscribe();
  }

  getTemplates() {
    return this.templates[this.selectedType];
  }

  selectTemplate(template: any) {
    this.selectedTemplate = template;
  }

  onSubmit() {
    if (this.selectedTemplate) {
      this.processState = ProcessState.LOADING;
      this.chatService.initChat(this.selectedType, this.selectedTemplate.id, this.jobId).subscribe({
        next: (res) => {
          this.processState = ProcessState.SUCCESS;
          setTimeout(() => this.result.emit({ type: this.selectedType, templateId: this.selectedTemplate.id }), 2000);          
        },
        error: (err) => {
          this.processState = ProcessState.ERROR;
        }
      })
    }
  }

  onCancel(): void{
    this.cancel.emit();
  }

}
