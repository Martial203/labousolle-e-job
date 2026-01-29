import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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

  get categories$(): Observable<Category[]> { return this._categories$.asObservable() }
  get jobs$(): Observable<Job[]> { return this._jobs$.asObservable() }

  constructor(private http: HttpClient){ }

  createJob(jobData: Job): Observable<any> {
    console.log(jobData)
    const body = {
      title: jobData.title,
      category: jobData.categoryId,
      company: jobData.companyId,
      expiration_date: formatDate(jobData.expirationDate, "yyyy-MM-dd", "en-US"),
      city: jobData.address,
      country: 'null',
      job_type: "permanent",
      image: jobData.coverImage,
      about: "null",
      description: jobData.description,
      profile_required: jobData.profileRequired,
      experience_required: 1,
      salary_min: 0,
      salary_max: 0,
      education_level: 'none',
      skills:[]
    }
    return this.http.post(`${environment.apiUrl}/jobs/`, body);
  }  

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/`).pipe(
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob))),
      tap(jobs => this._jobs$.next(jobs))
    );
  }

  getJobDetails(jobId: number): Observable<{ job: Job, company: Company, similarJobs: Job[] }> {
    return this.http.get<Job>(`${environment.apiUrl}/jobs/${jobId}/`).pipe(
      map((res: any) => {
        const job: Job = {
          id: res.id,
          title: res.title,
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
          creationDate: new Date(res.company_details.created_date),
          website: res.company_details.website,
          about: res.company_details.about,
          vision: res.company_details.vision,
          socialNetworks: {
            youtubeUrl: res.company_details.social_links.youtube,
            facebookUrl: res.company_details.social_links.facebook,
            instagramUrl: res.company_details.social_links.instagram,
            twitterUrl: res.company_details.social_links.twitter
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
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob)))
    );
  }

  getRecommendedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/jobs/recommended/`).pipe(
      map((res: any) => res.results.map((tmpJob: any) => this.mapJobResToJob(tmpJob)))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories/`).pipe(
      map(categories => categories.map((category: any) => this.mapCategory(category)))
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

  applyToJob(jobId: number): Observable<any> {
    const body = { }
    const email = 'martialnounga@gmail.com';
    const subject = 'Application to the role a Software engineer';
    const mailBody = 'Helloo, my name is Martial NOUNGA, and here I submit my application for the role of software engineer. You can see my CV and motivation letter in attachement.';
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${mailBody}`;
    window.open(mailtoUrl, '_blank');
    return this.http.post(`${environment.apiUrl}/jobs/${jobId}/apply/`, body);
  }

  searchJobs(query: JobSearchParams): Observable<{ jobs: Job[], count: number, page: number, totalPage: number }> {
    const params = new HttpParams();
    
    Object.keys(query).forEach((key: string) => {
      params.set(key, query[key])
    })
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
      profileRequired: tmpJob.profile_required ?? ' ',
    }
    return job;
  }

  private mapJobDetailsResToJob(tmpJob: any): Job {
    return {
      id: tmpJob.id,
      about: tmpJob.about,
      address: tmpJob.city,
      categoryId: tmpJob.category,
      categoryName: tmpJob.category_details.name,
      companyId: tmpJob.company,
      companyLogo: tmpJob.company_details.logo,
      companyName: tmpJob.company_details.name,
      coverImage: tmpJob.image,
      creationDate: new Date(tmpJob.created_date),
      description: tmpJob.description,
      experience: "1-2 ans",
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
