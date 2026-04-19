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

  constructor(private http: HttpClient) {
    this.getCompanies().subscribe();
  }

  private getCompanies(): Observable<Company[]>{
    return this.http.get<Company[]>(`${environment.apiUrl}/companies/`).pipe(
      map(res => res.map(company => this.mapCompanyResToCompany(company))),
      tap(companies => this._companies$.next(companies))
    );
  }

  getCompanyDetails(companyId: number): Observable<Company>{
    return this.http.get<Company>(`${environment.apiUrl}/companies/${companyId}/`).pipe(
      map(res => this.mapCompanyResToCompany(res))
    );
  }

  createCompany(company: Company): Observable<any>{
    const body: { [key: string]: any } = {
      logo: company.logo,
      name: company.name,
      company_type: company.type,
      company_size: company.size,
      website: company.website,
      founded_year: company.creationYear.toString(),
      vision: company.vision,
      about: company.about,
      address: company.address,
      latitude: 0,
      longitude: 0
    };
    const data = new FormData();
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    })
    return this.http.post(`${environment.apiUrl}/companies/`, data).pipe(
      map(res => this.mapCompanyResToCompany(res)),
      tap(res => {
        const companies = this._companies$.value;
        companies.push(res)
        this._companies$.next(companies)
      })
    );
  }

  updateSocialNetworks(companyId: number, socialNetworks: { [key: string]: string }): Observable<any>{
    const body = {
      social_links: socialNetworks
    }
    return this.http.patch(`${environment.apiUrl}/companies/${companyId}/`, body).pipe(
      map(res => this.mapCompanyResToCompany(res))
    );
  }

  updateContacts(companyId: number, contacts: { phone: string, email: string }): Observable<any>{
    const body = {
      phone: contacts.phone,
      email: contacts.email
    }
    return this.http.patch(`${environment.apiUrl}/companies/${companyId}/`, body);
  }

  updateCompany(companyId: number, company: Company): Observable<any>{
    const body = {
      // logo: company.logo,
      name: company.name,
      company_type: company.type,
      company_size: company.size,
      website: company.website,
      social_links: company.socialNetworks,
      founded_year: company.creationYear,
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
    const currentCompanies = this._companies$.getValue();
    const updatedCompanies = currentCompanies.filter(company => company.id !== companyId);
    this._companies$.next(updatedCompanies);
    return this.http.delete(`${environment.apiUrl}/companies/${companyId}/`);
  }

  private mapCompanyResToCompany(res: any): Company{
    console.log('res', res)
    return {
      id: res.id,
      about: res.about,
      email: res.email,
      logo: res.logo,
      name: res.name,
      phone: res.phone,
      size: res.company_size,
      type: this.getLabelFromValue(res.company_type),
      website: res.website,
      address: res.address,
      contacts: [],
      creationYear: new Date(res.created_date).getFullYear(),
      vision: res.vision,
      socialNetworks: {
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        linkedinUrl: ''
      },
      jobsCount: res.jobs_count ?? 0
    }
  }

  private getLabelFromValue(value: string): string {
    const map: Record<string, string> = {
      startup: 'Startup',
      multinational: 'Grande entreprise',
      public: 'Administration publique',
      pme: 'PME / PMI',
      ong: 'ONG / Association',
      other: 'Autre'
    };

    return map[value] || 'Autre';
  }
}
