import { Component } from '@angular/core';
import { Job } from '../../../../core/models/job/job';
import { Observable } from 'rxjs';
import { JobService } from '../../../../core/services/job/job.service';

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

  jobs$!: Observable<Job[]>;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {

  }

  onShowFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    console.log('Filter modal opened');
  }

  onChangePage(page: number): void {
    this.activePage = page;
  }
}
