import { Component } from '@angular/core';
import { Job, JobSearchParams } from '../../../../core/models/job/job';
import { Observable, tap } from 'rxjs';
import { JobService } from '../../../../core/services/job/job.service';
import { ActivatedRoute } from '@angular/router';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  standalone: false,
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsList {

  isFilterModalOpen: boolean = false;

  checked: boolean = false;
  activePage: number = 0;
  totalPages: number = 0;

  jobs$!: Observable<{ jobs: Job[], count: number, page: number, totalPage: number }>;
  params: JobSearchParams = new JobSearchParams();

  processState: ProcessState = ProcessState.LOADING;
  readonly PROCESS_STATES = ProcessState;

  constructor(private jobService: JobService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((_params: JobSearchParams) => {
      const params: JobSearchParams = _params as JobSearchParams ?? new JobSearchParams();
      this.params = params;
      this.jobs$ = this.jobService.searchJobs(params).pipe(tap(res => this.processJobsRes(res)));
    })    
  }

  getPages(pagesCount: number): number[] {
    return Array.from({ length: pagesCount }, (_, i) => i + 1);
  }

  onShowFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    console.log('Filter modal opened');
  }

  onSearch(params: JobSearchParams): void{
    this.processState = ProcessState.LOADING;
    console.log('params', params)
    this.jobs$ = this.jobService.searchJobs(params).pipe(tap(res => this.processJobsRes(res)));
    this.isFilterModalOpen = false;
  }

  onChangePage(page: number): void {
    this.processState = ProcessState.LOADING;
    this.activePage = page;
    this.params = { ...this.params, page };
    this.router.navigate(['/jobs'], { queryParams: this.params })
  }

  private processJobsRes(res: { jobs: Job[], count: number, page: number, totalPage: number }): void{
    this.activePage = res.page;
    this.totalPages = res.totalPage;
    this.processState = ProcessState.SUCCESS;
  }
}
