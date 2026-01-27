import { Component } from '@angular/core';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { Company } from '../../../../../core/models/company/company';

@Component({
  selector: 'app-general-infos-form',
  standalone: false,
  templateUrl: './general-infos-form.html',
  styleUrl: './general-infos-form.scss',
})
export class GeneralInfosForm {

  preview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  
  constructor(private companyService: CompanyService){ }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onResetLogo(): void{
    this.selectedFile = null;
    this.preview = null;
  }

  onSubmit(company: Company): void{
    this.companyService.createCompany(company);
  }
}
