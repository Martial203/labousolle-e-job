import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../../../../core/models/company/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-enterprise',
  standalone: false,
  templateUrl: './new-enterprise.html',
  styleUrl: './new-enterprise.scss',
})
export class NewEnterprise {

  company!: Company;
  tab: number = 0;

  @Input() isModal: boolean = false;
  @Output() created: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) { }

  onResetForm(): void{
    this.company = null!;
  }

  onValidateStep(company: Company): void{
    this.company = company;
    if(this.tab === 2) {
      if(this.isModal){
        this.created.emit();
      }else{
        this.tab = (this.tab+1)%3;
        this.router.navigateByUrl(`/admin/enterprises`);
      }
    }

  }
}
