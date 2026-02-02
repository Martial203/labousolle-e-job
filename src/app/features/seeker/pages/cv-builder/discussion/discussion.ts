import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../../../core/models/chat/chat';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';

@Component({
  selector: 'app-discussion',
  standalone: false,
  templateUrl: './discussion.html',
  styleUrl: './discussion.scss',
})
export class Discussion {

  readonly PROCESS_STATES = ProcessState;

  @Input() messages!: ChatMessage[]
  @Input() typingState: ProcessState = ProcessState.INACTIVE;

}
