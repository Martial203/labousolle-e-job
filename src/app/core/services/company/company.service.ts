import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Company } from '../../models/company/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  
  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]>{
    return this.http.get<Company[]>(`${environment.apiUrl}/companies/`);
  }

  getCompanyDetails(companyId: number): Observable<Company>{
    return this.http.get<Company>(`${environment.apiUrl}/companies/${companyId}/`);
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
}
