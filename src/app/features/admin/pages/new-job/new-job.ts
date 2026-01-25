import { Component } from '@angular/core';
import { Company } from '../../../../core/models/company/company';
import { map, Observable } from 'rxjs';
import { JobService } from '../../../../core/services/job/job.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import { Job } from '../../../../core/models/job/job';
import { ProcessState } from '../../../../core/enums/process-state/process-state';

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

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;

  constructor(private jobService: JobService, private companyService: CompanyService) {}

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

  onSubmit(value: Job): void{
    this.processState = ProcessState.LOADING;
    this.jobService.createJob(value).subscribe({
      next: (job) => {
        console.log('Job created successfully:', job);
        this.processState = ProcessState.SUCCESS;
      },
      error: (error) => {
        console.error('Error creating job:', error);
        this.processState = ProcessState.ERROR;
      }
    });
  }
}
