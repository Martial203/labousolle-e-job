import { Component, ViewChild } from '@angular/core';
import { Company } from '../../../../core/models/company/company';
import { map, Observable } from 'rxjs';
import { JobService } from '../../../../core/services/job/job.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import { Job } from '../../../../core/models/job/job';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { NgForm } from '@angular/forms';
import { ViewportScroller } from '@angular/common';

interface SelectOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-new-job',
  standalone: false,
  templateUrl: './new-job.html',
  styleUrl: './new-job.scss',
})
export class NewJob {

  displayDialog: boolean = false;

  experiences: string[] = ['Débutants', '1-2 ans', '2-4 ans', '4-6 ans', '6-8 ans', '8-10 ans', '10-15 ans', '15+ ans'];
  contractTypes: string[] = ['Tous', 'Emploi', 'Stage'];
  companies$!: Observable<SelectOption[]>;  
  categories$!: Observable<SelectOption[]>;

  preview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;

  @ViewChild("jobForm") jobForm!: NgForm;

  constructor(private jobService: JobService, private companyService: CompanyService, private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    this.companies$ = this.companyService.getCompanies().pipe(
      map(companies => companies.map(company => ({
        label: company.name,
        value: company.id
      })))
    );
    this.categories$ = this.jobService.getCategories().pipe(
      map(categories => categories.map(category => ({
        label: category.name,
        value: category.id
      })))
    );
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
    value.coverImage = new Blob([this.selectedFile], { type: this.selectedFile.type });
    value.categoryId = value.categoryId.value;
    value.companyId = value.companyId.value;
    this.jobService.createJob(value).subscribe({
      next: (job) => {
        console.log('Job created successfully:', job);
        this.processState = ProcessState.SUCCESS;
        this.jobForm.resetForm();
        this.selectedFile = null;
        this.preview = null;
        this.viewportScroller.scrollToPosition([0, 0]);
      },
      error: (error) => {
        console.error('Error creating job:', error);
        this.processState = ProcessState.ERROR;
      }
    });
  }
}
