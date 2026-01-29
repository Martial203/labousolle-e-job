import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { JobSearchParams } from '../../../../../core/models/job/job';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-advanced-filter',
  standalone: false,
  templateUrl: './advanced-filter.html',
  styleUrl: './advanced-filter.scss',
})
export class AdvancedFilter {

  @ViewChild('filterForm') filterForm!: NgForm;
  @Output() closeFilter: EventEmitter<void> = new EventEmitter<void>();
  @Output() filter: EventEmitter<JobSearchParams> = new EventEmitter<JobSearchParams>();

  experiences!: String[];
  contractTypes!: String[];
  params: JobSearchParams = new JobSearchParams();

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  onClose(): void {
    this.closeFilter.emit();
  }

  onGetSearch(val: JobSearchParams): void{
    this.params = { ...this.params, ...val, experience_max: this.filterForm.value.experience[0], job_type: this.filterForm.value.contract[0] }
    this.filter.emit(this.params);
  }

  private initData(): void {
    this.experiences = ['Débutants', '1-2 ans', '2-4 ans', '4-6 ans', '6-8 ans', '8-10 ans', '10-15 ans', '15+ ans'];
    this.contractTypes = ['Tous', 'Emploi', 'Stage'];
  }
}
