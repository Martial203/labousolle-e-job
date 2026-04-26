import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LoginCredentials } from '../../models/login-credentials/login-credentials';
import { ProcessState } from '../../../../core/enums/process-state/process-state';
import { mapObservableError } from '../../../../core/utils/utils';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { PASSWORD_SUFFIX } from '../../../../core/constants/constant';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  jobId!: string;
  loginError!: string;
  goToChatId!: string;
  private returnUrl!: string;

  readonly PROCESS_STATES = ProcessState;
  processState: ProcessState = ProcessState.INACTIVE;
  
  constructor(private authService: AuthService, private chatService: ChatService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const val = this.route.snapshot.queryParams['jobId'];
    const _returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const chatId = this.route.snapshot.queryParams['chatId'];
    if(_returnUrl) this.returnUrl = _returnUrl;
    if(val) this.jobId = val;
    if(chatId) this.goToChatId = chatId;
  }

  onSubmit(credentials: LoginCredentials): void {
    this.processState = ProcessState.LOADING;
    credentials.password += PASSWORD_SUFFIX;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        const migration = this.chatService.migrateChatSession();
        if(migration){
          migration.subscribe((session_id) => setTimeout(() => this.router.navigate(['/cv-builder'], { queryParams: { chatId: session_id } }), 2000))
        }else{
          setTimeout(() => {
            if(this.returnUrl){
              this.router.navigateByUrl(this.returnUrl);
            }else{
              this.router.navigateByUrl(this.jobId ? `/jobs/${this.jobId}` : '/');
            }
          }, 2000);
        }
      },
      error: (err: any) => {
        console.log(err);
        this.loginError = mapObservableError(err);
        this.processState = this.PROCESS_STATES.ERROR;
      }
    });
  }
}
