import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpCredentials } from '../../../features/auth/models/sign-up-credentials/sign-up-credentials';
import { LoginCredentials } from '../../../features/auth/models/login-credentials/login-credentials';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private http: HttpClient) {}

  signUp(credentials: SignUpCredentials): Observable<any>{
    const body = {
      nom: credentials.name,
      prenom: credentials.firstName,
      email: credentials.email,
      phoneNumber: credentials.phoneNumber ?? "0000000000",
      password: credentials.password,
      confirm_password: credentials.confirmPassword
    }
    return this.http.post(`${environment.apiUrl}/auth/register/`, body);
  }

  login(credentials: LoginCredentials): Observable<any>{
    const body = {
      identifier: credentials.email,
      password: credentials.password
    }
    return this.http.post(`${environment.apiUrl}/auth/login/`, body);
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
}
