import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Company } from '../../models/company/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  
  private _companies$: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  get companies$(): Observable<Company[]> { return this._companies$.asObservable() }

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]>{
    return this.http.get<Company[]>(`${environment.apiUrl}/companies/`).pipe(
      tap(companies => this._companies$.next(companies))
    );
  }

  getCompanyDetails(companyId: number): Observable<Company>{
    return this.http.get<Company>(`${environment.apiUrl}/companies/${companyId}/`).pipe(
      map(res => this.mapCompanyResToCompany(res))
    );
  }

  createCompany(company: Company): Observable<any>{
    const body = {
      logo: company.logo,
      name: company.name,
      company_type: company.type,
      company_size: company.size,
      website: company.website,
      social_links: company.socialNetworks,
      founded_year: company.creationDate,
      vision: company.vision,
      about: company.about,
      address: '',
      phone: company.phone,
      email: company.email,
      latitude: 0,
      longitude: 0
    };
    return this.http.post(`${environment.apiUrl}/companies/`, body);
  }

  updateCompany(companyId: number, company: Company): Observable<any>{
    const body = {
      logo: company.logo,
      name: company.name,
      company_type: company.type,
      company_size: company.size,
      website: company.website,
      social_links: company.socialNetworks,
      founded_year: company.creationDate,
      vision: company.vision,
      about: company.about,
      address: '',
      phone: company.phone,
      email: company.email,
      latitude: 0,
      longitude: 0
    };
    return this.http.patch(`${environment.apiUrl}/companies/${companyId}/`, body);
  }

  deleteCompany(companyId: number): Observable<any>{
    return this.http.delete(`${environment.apiUrl}/companies/${companyId}/`);
  }

  private mapCompanyResToCompany(res: any): Company{
    return {
      id: res.id,
      about: res.about,
      email: res.email,
      logo: res.logo,
      name: res.name,
      phone: res.phone,
      size: res.company_size,
      type: res.company_type,
      website: res.website,
      contacts: [],
      creationDate: new Date(res.created_date),
      vision: res.vision,
      socialNetworks: {
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: ''
      }
    }
  }
}
