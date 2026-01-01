import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotten-password',
  standalone: false,
  templateUrl: './forgotten-password.html',
  styleUrl: './forgotten-password.scss',
})
export class ForgottenPassword {

  emailSent: boolean = false;

  constructor(private router: Router) { }

  onSubmit(email: string): void{
    this.emailSent = true;
  }

  modifyEmail(): void {
    this.emailSent = false
  }

  onOtpSubmit(otp: string): void {
    if(otp.length === 6){
      this.router.navigateByUrl('/auth/new-password');
    }
  }
}
