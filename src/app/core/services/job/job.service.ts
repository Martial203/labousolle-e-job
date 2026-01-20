import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Category } from '../../models/category/category';
import { Job } from '../../models/job/job';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  
  private _categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  private _jobs$: BehaviorSubject<Job[]> = new BehaviorSubject<Job[]>([]);

  get categories$(): Observable<Category[]> { return this._categories$.asObservable() }
  get jobs$(): Observable<Job[]> { return this._jobs$.asObservable() }

  constructor(private http: HttpClient){ }

  getJobDetails(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${environment.apiUrl}/jobs/${jobId}/`);
  }

  getFeaturedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/featured/`);
  }

  getRecentJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/recent/`);
  }

  getRecommendedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/recommended/`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories/`).pipe(
      map(categories => categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        jobsCount: category.jobs_count
      })))
    );
  }
}
