import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-toolbar',
  standalone: false,
  templateUrl: './header-toolbar.html',
  styleUrl: './header-toolbar.scss',
})
export class HeaderToolbar {

  user!: User|null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.user ?? null;
  }

  getInitials(): string{
    if(this.user){
      return (this.user.name+" "+this.user.firstName).split(" ").map(word => word.charAt(0)).join("").toUpperCase() ?? "";
    }else{
      return "";
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error(err)
      }
    });
  }
}
