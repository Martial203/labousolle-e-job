import { Company } from './../../../../core/models/company/company';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../../core/services/job/job.service';
import { Observable, tap } from 'rxjs';
import { Job } from '../../../../core/models/job/job';
import { CompanyService } from '../../../../core/services/company/company.service';

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

  job$!: Observable<Job>;
  company$!: Observable<Company>;

  constructor(private jobService: JobService, private companyService: CompanyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void{
    const jobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.job$ = this.jobService.getJobDetails(jobId).pipe(
      tap(job => this.company$ = this.companyService.getCompanyDetails(job.companyId))
    );
  }

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
