import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private router: Router) {}

  onSubmit(credentials: { email: string, password: string }): void {
    console.log('Login attempt:', {
      email: credentials.email,
      password: credentials.password
    });

    this.router.navigateByUrl('/home');
  }
}
