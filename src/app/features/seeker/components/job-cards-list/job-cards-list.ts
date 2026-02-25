import { Component, Input } from '@angular/core';
import { Job } from '../../../../core/models/job/job';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-job-cards-list',
  standalone: false,
  templateUrl: './job-cards-list.html',
  styleUrl: './job-cards-list.scss',
})
export class JobCardsList {

  @Input() jobs: Job[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void { }

  onSelectJob(jobId: number): void {
    if(this.authService.user){
      this.router.navigateByUrl(`/jobs/${jobId}`);
    }else{
      this.router.navigate(['/auth/login'], { queryParams: { jobId: jobId } })
    }
  }

}
