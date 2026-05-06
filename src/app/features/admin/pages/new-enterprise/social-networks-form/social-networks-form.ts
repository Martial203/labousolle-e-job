import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Company } from '../../../../../core/models/company/company';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-social-networks-form',
  standalone: false,
  templateUrl: './social-networks-form.html',
  styleUrl: './social-networks-form.scss',
})
export class SocialNetworksForm {

  socialNetworks: string[] = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'Youtube'];

  networks: number[] = [];

  processState: ProcessState = ProcessState.INACTIVE;
  readonly PROCESS_STATES = ProcessState;

  @Input() editMode: boolean = true;
  @Input() company!: Company|null;
  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() value: EventEmitter<Company> = new EventEmitter<Company>();
  @ViewChild('socialLinksForm') socialLinksForm!: NgForm;

  constructor(private companyService: CompanyService) { }
  
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['company']) {
      if(changes['company'].currentValue === null) {
        this.socialLinksForm.resetForm();
        this.processState = ProcessState.INACTIVE;
      }

      if(this.company){
        this.company.socialNetworks = this.company.socialNetworks ?? {};
        const value = Object.entries(this.company.socialNetworks).map(([network, url]) => ({
          network: network.split('Url')[0].charAt(0).toUpperCase() + network.split('Url')[0].slice(1),
          url: url
        })).filter(item => item.network && item.network.trim() !== "" && item.url && item.url.trim() !== "");
        this.networks = Array.from({ length: value.length }, (_, i) => i + 1);
        const formData: any = {};
        value.forEach((item, index) => {
          formData[`link${index}`] = item;
        });
        console.log(formData)
        setTimeout(() => this.socialLinksForm.resetForm(formData));
      }
    }
  }

  addAField(): void{
    this.networks.push(this.networks.length);
  }

  removeAField(network: number): void{
    this.networks = this.networks.filter(n => n !== network);
  }

  onBack(): void{
    this.back.emit();
  }

  onSubmit(value: any): void{
    this.processState = ProcessState.LOADING;
    const val: { [key: string]: string } = {};
    Object.values(value).forEach((link: any) => {
      val[link.network.toLowerCase()] = link.url;
    });
    this.companyService.updateSocialNetworks(this.company!.id, val).subscribe({
      next: (res) => {
        this.company = res;
        this.processState = ProcessState.SUCCESS;
        this.value.emit(res);
      },
      error: () => {
        this.processState = ProcessState.ERROR;
      }
    });
  }
}
