import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { mapObservableError } from '../../../../core/utils/utils';

@Component({
  selector: 'app-new-password',
  standalone: false,
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss',
})
export class NewPassword {

  readonly PROCESS_STATES = ProcessState;

  processState: ProcessState = ProcessState.INACTIVE; 
  resetToken?: string;
  error!: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.resetToken = this.route.snapshot.paramMap.get('resetToken') ?? undefined;
  }

  onSubmit(data: { password: string, confirmPassword: string }): void {
    if(this.resetToken===undefined) return;
    this.processState = ProcessState.LOADING;
    this.authService.changePassword({ 
      resetToken: this.resetToken, 
      newPassword: data.password, 
      confirmPassword: data.confirmPassword
    }).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        setTimeout(() => this.router.navigateByUrl('/home'), 2000)
      },
      error: (err) => {
        console.log(err);
        this.error = mapObservableError(err)
        this.processState = ProcessState.ERROR;
      }
    })
  }
}
