import { Company } from './../../../../core/models/company/company';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../../core/services/job/job.service';
import { Observable, tap } from 'rxjs';
import { Job } from '../../../../core/models/job/job';
import { CompanyService } from '../../../../core/services/company/company.service';
import { ProcessState } from '../../../../core/enums/process-state/process-state';

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

  jobId!: number;
  job$!: Observable<{ job: Job, company: Company, similarJobs: Job[] }>;
  state: ProcessState = ProcessState.INACTIVE;
  readonly PROCESS_STATES = ProcessState;


  constructor(private jobService: JobService, private companyService: CompanyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void{
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.job$ = this.jobService.getJobDetails(this.jobId);
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

  onAdjustCV(title: string, companyName: string) {
    this.router.navigate([`/cv-builder/${this.jobId}`], {
      queryParams: { title: title, company: companyName }
    })
  }

  apply(): void{
    this.state = ProcessState.LOADING;
    this.jobService.applyToJob(this.jobId).subscribe({
      next: (res) => {
        console.log(res)
        this.state = ProcessState.SUCCESS
      },
      error: (err) => {
        console.log(err)
        this.state = ProcessState.ERROR
      }}
    );
  }
}
