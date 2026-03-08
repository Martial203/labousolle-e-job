import { Component, EventEmitter, Output } from '@angular/core';
import { TestimonyService } from '../../../../../core/services/testimony/testimony.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';

@Component({
  selector: 'app-add-testimony',
  standalone: false,
  templateUrl: './add-testimony.html',
  styleUrl: './add-testimony.scss',
})
export class AddTestimony {

  processState: ProcessState = ProcessState.INACTIVE;
  readonly PROCESS_STATES = ProcessState;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(private testimonyService: TestimonyService) { }

  sendComment(val: { rate: number, comment: string}): void{
    this.processState = ProcessState.LOADING;
    this.testimonyService.sendTestimonial(val.rate, val.comment).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        setTimeout(() => this.cancel.emit(), 2000);
      },
      error: (err) => {
        console.log(err)
        this.processState = ProcessState.ERROR;
      }
    })
  }

  onCancel(): void{
    this.cancel.emit()
  }
}
