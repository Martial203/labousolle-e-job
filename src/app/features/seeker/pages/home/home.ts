import { map, Observable } from 'rxjs';
import { Component } from '@angular/core';
import { JobService } from '../../../../core/services/job/job.service';
import { Category } from '../../../../core/models/category/category';
import { Job, JobSearchParams } from '../../../../core/models/job/job';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { TestimonyService } from '../../../../core/services/testimony/testimony.service';
import { Testimonial } from '../../../../core/models/testimonial/testimonial';

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
  testimonials$!: Observable<Testimonial[]>;

  totalJobs$!: Observable<number>;
  recentJobsTotal$!: Observable<number>;

  responsiveOptions: any[] | undefined;

  showAllCategories: boolean = false;

  constructor(private authService: AuthService, private jobService: JobService, private testimonyService: TestimonyService, private router: Router) { }

  ngOnInit(): void {
    this.recommendedJobs$ = this.jobService.getRecommendedJobs();
    this.trendingJobs$ = this.jobService.getFeaturedJobs();
    this.recentJobs$ = this.jobService.getRecentJobs();
    this.categories$ = this.jobService.categories$.pipe(map(categories => categories.filter(category => category.jobsCount !== 0)));
    this.userInterests$ = this.authService.getProfileInterests();
    this.testimonials$ = this.testimonyService.getTestimonies();
    this.totalJobs$ = this.jobService.totalJobs$;
    this.recentJobsTotal$ = this.jobService.totalRecentJobs$;

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

  onSearch(val: { job: string, city: string }): void {
    const params = new JobSearchParams();
    if(val.job.length>0) params.q = val.job;
    if(val.city.length>0) params.city = val.city;
    if(val.city.length>0 || val.job.length>0) this.router.navigate(['/jobs'], { queryParams: params });
  }

  onSearchByCategory(category: string): void{
    const params = new JobSearchParams();
    params.category = category.toLowerCase();
    this.router.navigate(['/jobs'], { queryParams: params });
  }


}
