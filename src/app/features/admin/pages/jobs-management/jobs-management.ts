import { JobService } from './../../../../core/services/job/job.service';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { Job } from '../../../../core/models/job/job';

interface JobRow {
  id: number;
  title: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-jobs-management',
  standalone: false,
  templateUrl: './jobs-management.html',
  styleUrl: './jobs-management.scss'
})
export class JobsManagement {
  
  jobs$!: Observable<Job[]>;
  items: MenuItem[] | undefined;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.jobs$ = this.jobService.getJobs();
  }

  mapToJobRow(jobs: Job[]): JobRow[] {
    if(!jobs) return [];
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      status: 'Active'
    }))
  }

  addJob(): void {
    // Handle add job logic
  }

  editJob(job: any): void {
    // Handle edit job logic
  }

  deleteJob(job: any): void {
    // Handle delete job logic
  }
}
