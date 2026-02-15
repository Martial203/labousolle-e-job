import { Component, ViewChild } from '@angular/core';
import { Company } from '../../../../core/models/company/company';
import { map, Observable } from 'rxjs';
import { JobService } from '../../../../core/services/job/job.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import { Job } from '../../../../core/models/job/job';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { NgForm } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface SelectOption {
  label: string;
  value: number|string;
}

@Component({
  selector: 'app-new-job',
  standalone: false,
  templateUrl: './new-job.html',
  styleUrl: './new-job.scss',
})
export class NewJob {

  displayDialog: boolean = false;

  experiences!: SelectOption[];
  contractTypes!: SelectOption[];
  companies$!: Observable<SelectOption[]>;  
  categories$!: Observable<SelectOption[]>;

  preview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  activeJob: Job | null = null;

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;

  @ViewChild("jobForm") jobForm!: NgForm;

  constructor(private jobService: JobService, private companyService: CompanyService, private viewportScroller: ViewportScroller, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initData();
    this.companies$ = this.companyService.companies$.pipe(
      map(companies => companies.map(company => ({
        label: company.name,
        value: company.id
      })))
    );
    this.categories$ = this.jobService.categories$.pipe(
      map(categories => categories.map(category => ({
        label: category.name,
        value: category.id
      })))
    );
  }

  ngAfterViewInit(): void {
    const jobId = this.route.snapshot.params['id'];
    if(jobId){
      this.jobService.getJobDetails(+jobId).subscribe({
        next: (res) => {
          const job = res.job;
          this.activeJob = job;
          this.preview = job.coverImage;
          this.selectedFile = new File([job.coverImage], 'cover.png', { type: 'image/png' });
          this.jobForm.resetForm({
            title: job.title,
            email: res.company.email,
            categoryId: job.categoryId,
            companyId: job.companyId,
            contractType: job.jobType,
            experience: job.experience,
            jobType: job.jobType,
            expirationDate: new Date(job.expirationDate),
            address: job.address,
            description: job.description,
            profileRequired: job.profileRequired
          });
        }
      });
    }
  }

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onResetCover(): void{
    this.selectedFile = null;
    this.preview = null;
  }

  onSubmit(value: any): void{
    this.processState = ProcessState.LOADING;
    console.log(value)
    if (!this.selectedFile) return;
    value.coverImage = this.selectedFile;
    value.categoryId = value.categoryId.value;
    value.companyId = value.companyId.value;
    const request: Observable<any> = this.activeJob ? this.jobService.updateAJob(this.activeJob.id, value) : this.jobService.createJob(value);
    request.subscribe({
      next: (job) => {
        console.log('Job created successfully:', job);
        this.processState = ProcessState.SUCCESS;
        this.jobForm.resetForm();
        this.selectedFile = null;
        this.preview = null;
        this.viewportScroller.scrollToPosition([0, 0]);
        if(this.activeJob){
          setTimeout(() => this.router.navigateByUrl('/admin/jobs'), 2000);
        }
      },
      error: (error) => {
        console.error('Error creating job:', error);
        this.processState = ProcessState.ERROR;
      }
    });
  }

  private initData(): void {
    this.experiences = [
      { label: 'Débutants', value: 1 },
      { label: '1-2 ans', value: 2 },
      { label: '2-4 ans', value: 4 },
      { label: '4-6 ans', value: 6 },
      { label: '6-8 ans', value: 8 },
      { label: '8-10 ans', value: 10 },
      { label: '10-15 ans', value: 15 },
      { label: '15+ ans', value: 20 }
    ];
    this.contractTypes = [
      { label: 'Emploi', value: 'permanent' },
      { label: 'Stage', value: 'internship' }
    ];
  }
}
