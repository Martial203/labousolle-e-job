import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  standalone: false,
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss',
})
export class NewPassword {

  success: boolean = false;

  constructor(private router: Router) {}

  onSubmit(password: string): void {
    this.success = true;
    setTimeout(() => this.router.navigateByUrl('/home'), 3000)
  }
}
