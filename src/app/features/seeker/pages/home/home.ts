import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  recommendedJobs!: any [];
  trendingJobs!: any [];
  recentJobs!: any [];
  categories!: any [];

  responsiveOptions: any[] | undefined;

  constructor() {}

  ngOnInit(): void {
    this.recommendedJobs = [0,1,2,3,4,5];
    this.trendingJobs = [0,1,2,3,4,5];
    this.recentJobs = [0,1,2,3,4,5];
    this.categories = [0,1,2,3,4,5,6,7];

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
