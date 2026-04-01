import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { Company } from '../../../../../core/models/company/company';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

interface Option{
  value: string;
  label: string
}

@Component({
  selector: 'app-general-infos-form',
  standalone: false,
  templateUrl: './general-infos-form.html',
  styleUrl: './general-infos-form.scss',
})
export class GeneralInfosForm {

  preview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  companyTypes!: Option[];
  companySizes!: Option[]; 

  processState: ProcessState = ProcessState.INACTIVE;
  readonly PROCESS_STATES = ProcessState;

  @Input() editMode: boolean = true;
  @Input() company!: Company|null;
  @Output() value: EventEmitter<Company> = new EventEmitter<Company>();
  @ViewChild('companyForm') companyForm!: NgForm;
  
  constructor(private companyService: CompanyService){ }

  ngOnInit(): void {
    this.initData();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['company']) {
      if(changes['company'].currentValue === null) {
        this.companyForm.resetForm();
        this.processState = ProcessState.INACTIVE;
      }
      if(this.company){
        console.log(this.company)
        if(this.company.logo){
          this.preview = this.company.logo;
          this.selectedFile = new File([this.company.logo], 'logo.png', { type: 'image/png' });
        }
        const date = new Date();
        date.setFullYear(this.company.creationYear)
        this.companyForm.resetForm({
          name: this.company.name,
          type: this.company.type,
          size: this.company.size,
          creationYear: date,
          website: this.company.website,
          address: this.company.address,
          about: this.company.about,
          vision: this.company.vision
        })
      }
    }
  }

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
    this.processState = ProcessState.LOADING;
    company.website = 'https://' + company.website.replace(/^(https?:\/\/)?/, '');
    company.logo = this.selectedFile;
    company.creationYear = new Date(company.creationYear).getFullYear();
    let request!: Observable<any>;
    if(this.company) {
      request = this.companyService.updateCompany(this.company.id, company)
    }else{
      request = this.companyService.createCompany(company)
    }
    request.subscribe({
      next: (res) => {
        this.processState = ProcessState.SUCCESS;
        this.value.emit(res);
      },
      error: () => this.processState = ProcessState.ERROR
    })
  }

  private initData(): void{
    this.companyTypes = [
      { label: 'Entreprise privée', value: 'Entreprise privée' }, 
      { label: 'Startup', value: 'Startup' },
      { label: 'Grande entreprise', value: 'Grande entreprise' },
      { label: 'Administration publique', value: 'Administration publique' },
      { label: 'PME / PMI', value: 'PME / PMI' },
      { label: 'Organisation internationale', value: 'Organisation internationale' },
      { label: 'ONG / Association', value: 'ONG / Association' },
      { label: 'Freelance / Indépendant', value: 'Freelance / Indépendant' },
      { label: 'Autre', value: 'Autre' }
    ]

    this.companySizes = [
      { label: '1-10', value: '1-10' },
      { label: '11-50', value: '11-50' },
      { label: '51-200', value: '51-200' },
      { label: '201-500', value: '201-500' },
      { label: '500+', value: '500+' }
    ]
  }
}
