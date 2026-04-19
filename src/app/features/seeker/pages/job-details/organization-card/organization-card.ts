import { Component, Input } from '@angular/core';
import { Company } from '../../../../../core/models/company/company';
import { DEFAULT_WEBSITE_URL } from '../../../../../core/constants/constant';

@Component({
  selector: 'app-organization-card',
  standalone: false,
  templateUrl: './organization-card.html',
  styleUrl: './organization-card.scss',
})
export class OrganizationCard {

  readonly DefaultWebsiteUrl: string = DEFAULT_WEBSITE_URL;
  @Input() company!: Company;

}
