import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { Company } from '../../../../core/models/company/company';
import { CompanyService } from '../../../../core/services/company/company.service';

interface CompanyRow {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-enterprises-management',
  standalone: false,
  templateUrl: './enterprises-management.html',
  styleUrl: './enterprises-management.scss',
})
export class EnterprisesManagement {

  companies$!: Observable<Company[]>;

  constructor(private companyService: CompanyService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.companies$ = this.companyService.getCompanies();
  }

  confirmDeletion(event: Event, enterpriseId: number): void {
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

  deleteAnEnterprise(enterpriseId: number): void{
    this.companyService.deleteCompany(enterpriseId);
  }

  mapToCompanyRow(companies: Company[]): CompanyRow[] {
    console.log(companies)
    return companies.map(company => ({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone
    }))
  }

}
