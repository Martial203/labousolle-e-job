import { Component, Input } from '@angular/core';
import { Company } from '../../../../../core/models/company/company';

@Component({
  selector: 'app-organization-card',
  standalone: false,
  templateUrl: './organization-card.html',
  styleUrl: './organization-card.scss',
})
export class OrganizationCard {

  @Input() company!: Company;

}
