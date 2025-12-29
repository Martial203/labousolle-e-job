import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginData = {
    email: '',
    password: '',
    remember: false
  };

  onSubmit(): void {
    console.log('Login attempt:', {
      email: this.loginData.email,
      password: '***',
      remember: this.loginData.remember
    });
    
    // Ajoutez ici votre logique de connexion
    // Par exemple: this.authService.login(this.loginData.email, this.loginData.password)
  }

  onGoogleSignIn(): void {
    console.log('Google sign-in clicked');
    
    // Ajoutez ici votre logique de connexion Google
    // Par exemple: this.authService.signInWithGoogle()
  }
}
