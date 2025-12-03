import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-details',
  standalone: false,
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails {

  isSubmitModalOpen: boolean = false;

  constructor(private router: Router) { }

  onShowSubmitModal() {
    this.isSubmitModalOpen = true;
  }

  onAdjustCV() {
    this.router.navigateByUrl('/')
  }
}
