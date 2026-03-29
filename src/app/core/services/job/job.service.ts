import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { Category } from '../../models/category/category';
import { Company } from '../../models/company/company';
import { Job, JobSearchParams } from '../../models/job/job';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  
  private _categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  private _jobs$: BehaviorSubject<Job[]> = new BehaviorSubject<Job[]>([]);
  private _totalJobs$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _totalRecentJobs$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  get categories$(): Observable<Category[]> { return this._categories$.asObservable() }
  get jobs$(): Observable<Job[]> { return this._jobs$.asObservable() }
  get totalJobs$(): Observable<number> { return this._totalJobs$.asObservable() }
  get totalRecentJobs$(): Observable<number> { return this._totalRecentJobs$.asObservable() }

  constructor(private http: HttpClient){
    this.getCategories().subscribe(categories => this._categories$.next(categories));
    this.getJobs().subscribe(jobs => this._jobs$.next(jobs));
  }

  createJob(jobData: Job): Observable<any> {
    console.log(jobData)
    const body: { [key: string]: any } = {
      title: jobData.title,
      category: jobData.categoryId.toString(),
      company: jobData.companyId.toString(),
      expiration_date: formatDate(jobData.expirationDate, "yyyy-MM-dd", "en-US"),
      city: jobData.address,
      country: jobData.email,
      job_type: jobData.jobType,
      image: jobData.coverImage,
      about: "null",
      description: jobData.description,
      profile_required: 'Empty',
      experience_required: jobData.experience,
      salary_min: '0',
      salary_max: '0',
      education_level: 'none',
      skills: JSON.stringify(["empty", "null"])
    }
    const formData = new FormData()
    Object.keys(body).forEach(key => formData.append(key, body[key]))
    return this.http.post(`${environment.apiUrl}/jobs/`, formData).pipe(tap((res: any) => {
      const jobs = this._jobs$.value;
      jobs.push(jobData);
      this._jobs$.next(jobs);
    }));
  }  

  private getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/`).pipe(
      tap((res: any) => this._totalJobs$.next(res.total)),
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob)))
    );
  }

  getJobDetails(jobId: number): Observable<{ job: Job, company: Company, similarJobs: Job[] }> {
    return this.http.get<Job>(`${environment.apiUrl}/jobs/${jobId}/`).pipe(
      map((res: any) => {
        const job: Job = {
          id: res.id,
          title: res.title,
          email: res.country,
          address: res.city,
          coverImage: res.image,
          companyId: res.company,
          companyName: res.company_details.name,
          companyLogo: res.company_details.logo,
          categoryId: res.category,
          categoryName: res.category_details.name,
          expirationDate: res.expiration_date,
          creationDate: new Date(res.created_date),
          isFeatured: true,
          jobType: res.job_type,
          about: res.about,
          description: res.description,
          profileRequired: res.profile_required,
          experience: res.experience_required
        }
        const similarJobs: Job[] = res.similar_jobs.map((tmpJob: any) => ({
          id: tmpJob.id,
          title: tmpJob.title,
          address: tmpJob.city,
          coverImage: tmpJob.image,
          companyId: 0,
          companyName: tmpJob.company_name,
          companyLogo: tmpJob.company_logo,
          categoryId: 0,
          categoryName: ' ',
          expirationDate: new Date(),
          creationDate: new Date(),
          isFeatured: true,
          jobType: tmpJob.job_type,
          about: ' ',
          description: ' ',
          profileRequired: ' ',
          experience: ' '
        }))
        const company: Company = {
          id: res.company_details.id,
          name: res.company_details.name,
          email: res.company_details.email,
          phone: res.company_details.phone,
          logo: res.company_details.logo,
          type: " ",
          size: " ",
          address: "",
          creationYear: new Date(res.company_details.created_date).getFullYear(),
          website: res.company_details.website,
          about: res.company_details.about,
          vision: res.company_details.vision,
          socialNetworks: {
            youtubeUrl: res.company_details.social_links.youtube,
            facebookUrl: res.company_details.social_links.facebook,
            instagramUrl: res.company_details.social_links.instagram,
            twitterUrl: res.company_details.social_links.twitter,
            linkedinUrl: res.company_details.social_links.linkedin
          },
          contacts: []
        }

        return { job, company, similarJobs };
      })
    );
  }

  getFeaturedJobs(): Observable<Job[]> {
    const params: HttpParams = new HttpParams();
    params.set('page', '0');
    params.set('page_size', '50');
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/featured/`, { params }).pipe(
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob)))
    );
  }

  getRecentJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/recent/`).pipe(
      tap((res: any) => this._totalRecentJobs$.next(res.total)),
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob)))
    );
  }

  getRecommendedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/recommended/`).pipe(
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob)))
    );
  }

  private getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories/`).pipe(
      map(categories => categories.map((category: any) => this.mapCategory(category)))
    );
  }

  updateAJob(jobId: number, jobData: Job): Observable<any> {
    const body: { [key: string]: any } = {
      title: jobData.title,
      category: jobData.categoryId.toString(),
      company: jobData.companyId.toString(),
      expiration_date: formatDate(jobData.expirationDate, "yyyy-MM-dd", "en-US"),
      city: jobData.address,
      country: jobData.email,
      job_type: jobData.jobType,
      image: jobData.coverImage,
      about: "null",
      description: jobData.description,
      profile_required: 'Empty',
      experience_required: jobData.experience,
      salary_min: '0',
      salary_max: '0',
      education_level: 'none',
      skills: JSON.stringify(["empty", "null"])
    }
    const formData = new FormData()
    Object.keys(body).forEach(key => formData.append(key, body[key]))
    return this.http.patch(`${environment.apiUrl}/jobs/${jobId}/`, formData);
  }

  deleteAJob(jobId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/jobs/${jobId}/`).pipe(tap(() => {
      const jobs = this._jobs$.value;
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      this._jobs$.next(updatedJobs);
    }));
  }

  applyToJob(jobId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/jobs/${jobId}/generate_application_email/`).pipe(
      tap((res: any) => {
        const email = this._jobs$.value.find(job => job.id === jobId)?.email;
        console.log('Email 2', email)
        const subject = encodeURIComponent(res.subject);
        const body = encodeURIComponent(res.body);
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        const mail = window.open(mailtoUrl, '_blank');
      })
    )
  }

  searchJobs(query: JobSearchParams): Observable<{ jobs: Job[], count: number, page: number, totalPage: number }> {
    const params = new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(query).filter(
          ([_, v]) => v !== undefined && v !== null && v !== ''
        )
      )
    });   

    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/search/`, { params }).pipe(
      map((res: any) => {
        const jobs: Job[] = res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob));
        return {
          jobs: jobs,
          count: res.total,
          page: res.page,
          totalPage: res.total_pages
        }
      })
    );
  }

  private mapJobResToJob(tmpJob: any): Job {
    const job: Job = {
      id: tmpJob.id,
      title: tmpJob.title,
      description: tmpJob.description,
      about: ' ',
      email: tmpJob.country,
      address: tmpJob.city,
      categoryId: tmpJob.category,
      categoryName: tmpJob.category_name,
      companyId: tmpJob.company,
      coverImage: tmpJob.image,
      companyLogo: tmpJob.company_logo,
      companyName: tmpJob.company_name,
      creationDate: tmpJob.created_date,
      expirationDate: tmpJob.expiration_date,
      experience: "Bac",
      isFeatured: tmpJob.is_featured,
      jobType: tmpJob.job_type,
      profileRequired: tmpJob.profile_required ?? 'Empty',
    }
    return job;
  }

  private mapJobDetailsResToJob(tmpJob: any): Job {
    return {
      id: tmpJob.id,
      about: tmpJob.about,
      address: tmpJob.city,
      email: tmpJob.country,
      categoryId: tmpJob.category,
      categoryName: tmpJob.category_details.name,
      companyId: tmpJob.company,
      companyLogo: tmpJob.company_details.logo,
      companyName: tmpJob.company_details.name,
      coverImage: tmpJob.image,
      creationDate: new Date(tmpJob.created_date),
      description: tmpJob.description,
      experience: tmpJob.experience_required,
      expirationDate: new Date(tmpJob.expiration_date),
      isFeatured: true,
      jobType: tmpJob.job_type,
      profileRequired: tmpJob.profile_required,
      title: tmpJob.title,
    }
  }

  private mapCategory(res: any): Category{
    return {
      id: res.id,
      name: res.name,
      description: res.description,
      icon: res.icon,
      jobsCount: res.jobs_count
    }
  }
}
