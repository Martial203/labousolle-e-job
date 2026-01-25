import { Component } from '@angular/core';
import { JobService } from '../../../../core/services/job/job.service';

@Component({
  selector: 'app-new-enterprise',
  standalone: false,
  templateUrl: './new-enterprise.html',
  styleUrl: './new-enterprise.scss',
})
export class NewEnterprise {

  constructor(private jobService: JobService) { }

  addNewJob(): void {
    
  }
}
