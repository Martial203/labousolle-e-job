import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Company } from '../../../../../core/models/company/company';
import { ProcessState } from '../../../../../core/enums/process-state/process-state';
import { CompanyService } from '../../../../../core/services/company/company.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacts-form',
  standalone: false,
  templateUrl: './contacts-form.html',
  styleUrl: './contacts-form.scss',
})
export class ContactsForm {
  cities: any[] = [];
  
  processState: ProcessState = ProcessState.INACTIVE;
  readonly PROCESS_STATES = ProcessState;

  @Input() editMode: boolean = true;
  @Input() company!: Company|null;
  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() value: EventEmitter<Company> = new EventEmitter<Company>();

  @ViewChild('contactForm') contactForm!: NgForm;

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['company']) {
      if(changes['company'].currentValue === null) {
        this.contactForm.resetForm();
        this.processState = ProcessState.INACTIVE;
      }
      if(this.company){
        this.contactForm.resetForm({
          phone: '+23765968596',
          email: 'this.company.email',
        });
      }
    }
  }

  onBack(): void{
    this.back.emit();
  }

  onSetContacts(contacts: { phone: string, email: string }): void{
    this.processState = ProcessState.LOADING;
    this.companyService.updateContacts(this.company!.id, contacts).subscribe({
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
