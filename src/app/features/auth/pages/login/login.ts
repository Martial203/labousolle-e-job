import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LoginCredentials } from '../../models/login-credentials/login-credentials';
import { ProcessState } from '../../../../core/enums/process-state/process-state';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  readonly PROCESS_STATES = ProcessState;

  processState: ProcessState = ProcessState.INACTIVE;
  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(credentials: LoginCredentials): void {
    this.processState = ProcessState.LOADING;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        setTimeout(() => this.router.navigateByUrl('/'), 2000);
      },
      error: (err) => {
        console.log(err);
        this.processState = this.PROCESS_STATES.ERROR;
      }
    });
  }
}
