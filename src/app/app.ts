import { Component, signal } from '@angular/core';
import { Login } from './features/auth/pages/login/login';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('laboussolle-e-job');

  ngOnInit(): void {
  }
}

