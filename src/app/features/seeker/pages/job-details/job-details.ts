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
  isDocUploadModalOpen: boolean = false;
  isSuccessfullySubmittedModalOpen: boolean = false;

  constructor(private router: Router) { }

  onShowSubmitModal(open: boolean) {
    this.isSubmitModalOpen = open;
  }

  onShowDocUploadModal(open: boolean) {
    this.isDocUploadModalOpen = open;
    this.onShowSubmitModal(false);
  }

  onShowSuccessfullySubmittedModal(open: boolean) {
    this.isSuccessfullySubmittedModalOpen = open;
    this.onShowDocUploadModal(false);
  }

  onAdjustCV() {
    this.router.navigateByUrl('/cv-builder')
  }
}
