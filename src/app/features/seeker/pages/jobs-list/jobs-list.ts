import { Component } from '@angular/core';
import { Job, JobSearchParams } from '../../../../core/models/job/job';
import { Observable } from 'rxjs';
import { JobService } from '../../../../core/services/job/job.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  standalone: false,
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsList {

  isFilterModalOpen: boolean = false;

  checked: boolean = false;
  activePage: number = 1;
  totalPages: number = 5;

  jobs$!: Observable<{ jobs: Job[], count: number, page: number, totalPage: number }>;

  constructor(private jobService: JobService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const params: JobSearchParams = this.route.snapshot.queryParams ?? new JobSearchParams();
    this.jobs$ = this.jobService.searchJobs(params);
  }

  getPages(pagesCount: number): number[] {
    return new Array<number>(pagesCount);
  }

  onShowFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    console.log('Filter modal opened');
  }

  onSearch(params: JobSearchParams): void{
    this.jobs$ = this.jobService.searchJobs(params);
  }

  onChangePage(page: number): void {
    this.activePage = page;
  }
}
