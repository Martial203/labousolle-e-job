import { Component, Input } from '@angular/core';
import { Job } from '../../../../core/models/job/job';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-cards-list',
  standalone: false,
  templateUrl: './job-cards-list.html',
  styleUrl: './job-cards-list.scss',
})
export class JobCardsList {

  @Input() jobs: Job[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void { }

  onSelectJob(jobId: number): void {
    this.router.navigateByUrl(`/jobs/${jobId}`);
  }

}
