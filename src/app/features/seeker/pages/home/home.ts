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

  constructor() {}

  ngOnInit(): void {
    this.recommendedJobs = [0,1,2,3,4,5];
    this.trendingJobs = [0,1,2,3,4,5];
    this.recentJobs = [0,1,2,3,4,5];
    this.categories = [0,1,2,3,4,5,6,7];
  }
}
