import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { Company } from '../../../../../core/models/company/company';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { NgForm } from '@angular/forms';

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
    company.logo = this.selectedFile;
    company.creationYear = new Date(company.creationYear).getFullYear();
    console.log(company);
    this.processState = ProcessState.LOADING;
    this.companyService.createCompany(company).subscribe({
      next: (res) => {
        this.processState = ProcessState.SUCCESS;
        this.value.emit(res);
      },
      error: () => this.processState = ProcessState.ERROR
    })
  }

  private initData(): void{
    this.companyTypes = [
      { label: 'Startup', value: 'startup' },
      { label: 'PME', value: 'pme' },
      { label: 'Multinationale', value: 'multinational' },
      { label: 'ONG', value: 'ong' },
      { label: 'Publique', value: 'public' },
      { label: 'Other', value: 'other' }
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
