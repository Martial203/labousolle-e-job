import { JobService } from './../../../../core/services/job/job.service';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../../core/models/category/category';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProcessState } from '../../../../core/enums/process-state/process-state';

@Component({
  selector: 'app-choose-interests',
  standalone: false,
  templateUrl: './choose-interests.html',
  styleUrl: './choose-interests.scss',
})
export class ChooseInterests {

  processState: ProcessState = ProcessState.INACTIVE;
  readonly PROCESS_STATES = ProcessState;

  selectedInterestsIds: Set<number> = new Set<number>();
  interests$!: Observable<Category[]>;

  constructor(private authService: AuthService, private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.initInterests();
  }

  toggleInterest(index: number): void {
    if(!this.selectedInterestsIds.delete(index)) this.selectedInterestsIds.add(index);
  }

  onSubmit(): void {
    this.processState = ProcessState.LOADING;
    this.authService.setProfileInterests(Array.from(this.selectedInterestsIds)).subscribe({
      next: () => {
        this.processState = ProcessState.SUCCESS;
        setTimeout(() => this.router.navigateByUrl('/home'), 3000);
      },
      error: (err) => {
        console.log(err)
        this.processState = ProcessState.ERROR;
      }
    })
  }

  private initInterests(): void {
    this.interests$ = this.jobService.getCategories();
  }
}
