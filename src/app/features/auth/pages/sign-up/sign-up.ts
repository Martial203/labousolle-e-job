import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpCredentials } from '../../models/sign-up-credentials/sign-up-credentials';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { mapObservableError } from '../../../../core/utils/utils';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {

  readonly PASSWORD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  readonly PROCESS_STATES = ProcessState;

  processState: ProcessState = ProcessState.INACTIVE;
  error!: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  onSubmit(credentials: SignUpCredentials): void {
    this.processState = ProcessState.LOADING;
    this.authService.signUp(credentials).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        setTimeout(() => this.router.navigateByUrl('/auth/choose-interests'), 2000);
      },
      error: (err) => {
        console.log(err)
        this.error = mapObservableError(err);
        this.processState = ProcessState.ERROR;
      }
    });
  }
}
