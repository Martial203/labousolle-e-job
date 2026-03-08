import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../../../../core/models/company/company';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../core/services/company/company.service';

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
  @Input() editMode: boolean = true;
  @Output() created: EventEmitter<void> = new EventEmitter<void>();

  constructor(private companyService: CompanyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const companyId = this.route.snapshot.params['id'];
    if(companyId){
      this.companyService.getCompanyDetails(+companyId).subscribe(res => this.company = res);
    }
    if(this.route.snapshot.queryParams['mode'] === 'view') this.editMode = false;
  }

  onResetForm(): void{
    this.company = null!;
  }

  onValidateStep(company: Company): void{
    this.company = company;
    if(this.tab === 2) {
      if(this.isModal){
        this.created.emit();
      }else{
        this.router.navigateByUrl(`/admin/enterprises`);
      }
    }
    this.tab = (this.tab+1)%3;
  }
}
