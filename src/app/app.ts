import { Component, signal } from '@angular/core';
import { Login } from './features/auth/pages/login/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {

  showHeader: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.showHeader = !currentRoute.startsWith('/auth');
    });
  }

}

