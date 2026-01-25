import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpCredentials } from '../../../features/auth/models/sign-up-credentials/sign-up-credentials';
import { LoginCredentials } from '../../../features/auth/models/login-credentials/login-credentials';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../models/category/category';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  readonly USER_KEY = 'user-key';

  user!: User;
  
  constructor(private http: HttpClient) {
    this.retrieveUserInfosLocally();
  }

  signUp(credentials: SignUpCredentials): Observable<any>{
    const body = {
      nom: credentials.name,
      prenom: credentials.firstName,
      email: credentials.email,
      phoneNumber: credentials.phoneNumber ?? "0000000000",
      password: credentials.password,
      confirm_password: credentials.confirmPassword
    }
    return this.http.post(`${environment.apiUrl}/auth/register/`, body).pipe(
      tap((res: any) => this.user = this.mapLoginResponseToUser(res))
    );
  }

  login(credentials: LoginCredentials): Observable<any>{
    const body = {
      identifier: credentials.email,
      password: credentials.password
    }
    return this.http.post(`${environment.apiUrl}/auth/login/`, body).pipe(
      tap((res: any) => this.user = this.mapLoginResponseToUser(res))
    );
  }

  logout(): Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/logout/`, null);
  }

  orderPasswordReset(email: string): Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/password-reset/send-code/`, { email });
  }

  verifyOtpCode(data: { email: string, code: string }): Observable<any>{
    const body = {
      email: data.email,
      otp_code: data.code
    }
    return this.http.post(`${environment.apiUrl}/auth/password-reset/verify-code/`, body);
  }

  changePassword(data: { resetToken: string, newPassword: string, confirmPassword: string}){
    const body = {
      reset_token: data.resetToken,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword
    }
    return this.http.post(`${environment.apiUrl}/auth/password-reset/reset/`, body);
  }

  setProfileInterests(interestsIds: number[]): Observable<any>{
    const body = {
      category_ids: interestsIds
    }
    return this.http.post<any>(`${environment.apiUrl}/auth/choose-interests/`, body);
  }

  getProfileInterests(): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.apiUrl}/auth/choose-interests/`).pipe(
      map(categories => categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        jobsCount: category.jobs_count
      })))
    );
  }

  private mapLoginResponseToUser(res: any): User{
    const userInfos: User = {
      id: res.user.id,
      name: res.user.nom,
      firstName: res.user.prenom,
      email: res.user.email,
      role: res.user.role,
      token: res.token
    };
    this.saveUserInfosLocally(userInfos);
    return userInfos;
  }

  private saveUserInfosLocally(user: User): void{
    console.log(user)
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private retrieveUserInfosLocally(): void{
    const val = localStorage.getItem(this.USER_KEY);
    if(val) this.user = JSON.parse(val);
    console.log(val)
  }
}
