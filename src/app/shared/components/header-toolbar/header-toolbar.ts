import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user/user';
import { Router } from '@angular/router';
import { DocumentType } from '../../../core/enums/document-type/document-type';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-header-toolbar',
  standalone: false,
  templateUrl: './header-toolbar.html',
  styleUrl: './header-toolbar.scss',
})
export class HeaderToolbar {

  user!: User|null;
  readonly DOCUMENT_TYPES = DocumentType;

  displayDrawer: boolean = false;

  constructor(private authService: AuthService, private confirmationService: ConfirmationService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.user ?? null;
  }

  onToggleDrawer(): void{
    this.displayDrawer = !this.displayDrawer;
  }

  getInitials(): string{
    if(this.user){
      return (this.user.name+" "+this.user.firstName).split(" ").map(word => word.charAt(0)).join("").toUpperCase() ?? "";
    }else{
      return "";
    }
  }

  onLogout(): void {
    this.confirmationService.confirm({
      message: "Voulez vous vraiment vous déconnecter ?",
      header: "Déconnection",
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger'
      },
      accept: () => this.logout()
    })
  }

  private logout(): void{
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error(err)
        alert("La déconnection a échouée, veuillez ressayer !")
      }
    });
  }
}
