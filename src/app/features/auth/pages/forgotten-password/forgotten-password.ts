import { AuthService } from './../../../../core/services/auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessState } from '../../../../core/enums/process-state/process-state';

@Component({
  selector: 'app-forgotten-password',
  standalone: false,
  templateUrl: './forgotten-password.html',
  styleUrl: './forgotten-password.scss',
})
export class ForgottenPassword {

  readonly PROCESS_STATES = ProcessState;
  
  processState: ProcessState = ProcessState.INACTIVE;
  emailSent: string|null = null;


  constructor(private authService: AuthService, private router: Router) { }

  onInitPasswordReset(email: string): void{
    this.processState = ProcessState.LOADING;
    this.authService.orderPasswordReset(email).subscribe({
      next: () => {
        this.processState = ProcessState.INACTIVE;
        this.emailSent = email;
      },
      error: (err) => {
        console.log(err);
        this.processState = ProcessState.ERROR;
      }
    });
  }

  modifyEmail(): void {
    this.emailSent = null
  }

  onOtpSubmit(otp: string): void {
    if(this.emailSent==null) return;
    this.processState = ProcessState.LOADING;
    this.authService.verifyOtpCode({ email: this.emailSent, code: otp }).subscribe({
      next: (res) => {
        this.processState = ProcessState.SUCCESS;
        setTimeout(() => this.router.navigateByUrl(`/auth/new-password/${res.reset_token}`), 2000);
      },
      error: (err) => {
        console.log(err);
        this.processState = ProcessState.ERROR;
      }
    })
  }
}
