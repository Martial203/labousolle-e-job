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

  createJob(jobData: Job): Observable<any> {
    const body = {
      title: jobData.title,
      category: jobData.categoryId,
      company: jobData.companyId,
      expiration_date: jobData.expirationDate,
      city: jobData.address,
      country: ' ',
      job_type: jobData.jobType,
      image: ' ',
      about: jobData.about,
      description: jobData.description,
      profile_required: jobData.profileRequired,
      experience_required: jobData.experience,
      salary_min: 0,
      salary_max: 0,
      education_level: ' ',
      skills:[]
    }
    return this.http.post(`${environment.apiUrl}/jobs/`, body);
  }  

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

  updateAJob(jobId: number, jobData: Job): Observable<any> {
    const body = {

    }
    return this.http.patch(`${environment.apiUrl}/jobs/${jobId}/`, jobData);
  }

  deleteAJob(jobId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/jobs/${jobId}/`);
  }

  applyToJob(jobId: number, applicantData: { cv: string, coverLetter: string }): Observable<any> {
    const body = {
      cv: applicantData.cv,
      cover_letter: applicantData.coverLetter
    }
    return this.http.post(`${environment.apiUrl}/jobs/${jobId}/apply/`, body);
  }

  searchJobs(query: string): Observable<Job[]> {
    const body = {};
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/search/?q=${query}`);
  }
}
