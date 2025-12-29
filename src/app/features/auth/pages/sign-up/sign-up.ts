import { Component } from '@angular/core';

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

  constructor() {}

  onSubmit(): void {
    // Vérification que les mots de passe correspondent
    if (this.signupData.password !== this.signupData.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas');
      // Vous pouvez afficher un message d'erreur à l'utilisateur
      // Par exemple avec PrimeNG MessageService
      return;
    }

    console.log('Signup attempt:', {
      name: this.signupData.name,
      surname: this.signupData.surname,
      email: this.signupData.email,
      password: '***',
      acceptTerms: this.signupData.acceptTerms
    });
    
    // Ajoutez ici votre logique d'inscription
    // Par exemple: this.authService.signup(this.signupData)
  }

  onGoogleSignUp(): void {
    console.log('Google sign-up clicked');
    
    // Ajoutez ici votre logique d'inscription Google
    // Par exemple: this.authService.signUpWithGoogle()
  }
}
