import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  signupData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  success: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    this.success = true;
    setTimeout(() => this.router.navigateByUrl('/auth/choose-interests'), 3000)
  }

}
