import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { JobService } from '../../../../core/services/job/job.service';
import { Category } from '../../../../core/models/category/category';
import { Job } from '../../../../core/models/job/job';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  recommendedJobs$!: Observable<Job[]>;
  trendingJobs$!: Observable<Job[]>;
  recentJobs$!: Observable<Job[]>;
  categories$!: Observable<Category[]>;
  userInterests$!: Observable<Category[]>;

  responsiveOptions: any[] | undefined;

  showAllCategories: boolean = false;

  constructor(private authService: AuthService, private jobService: JobService) {}

  ngOnInit(): void {
    this.recommendedJobs$ = this.jobService.getRecommendedJobs();
    this.trendingJobs$ = this.jobService.getFeaturedJobs();
    this.recentJobs$ = this.jobService.getRecentJobs();
    this.categories$ = this.jobService.categories$;
    this.userInterests$ = this.authService.getProfileInterests();
    
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
  ]
}


}
