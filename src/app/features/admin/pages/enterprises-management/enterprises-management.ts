import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-enterprises-management',
  standalone: false,
  templateUrl: './enterprises-management.html',
  styleUrl: './enterprises-management.scss',
})
export class EnterprisesManagement {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirmDeletion(event: Event, enterpriseId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez vous vraiment supprimer cette entreprise ?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger'
      },
      accept: () => {
        this.deleteAnEnterprise(enterpriseId);
        this.messageService.add({ severity: 'primary', summary: 'Confirmé', detail: 'Entreprise supprimée avec succès.' });
      }
    });
  }

  deleteAnEnterprise(enterpriseId: string): void{
    
  }
}
