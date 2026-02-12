import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { JobSearchParams } from '../../../../../core/models/job/job';
import { NgForm } from '@angular/forms';

interface SelectOption{
  label: string;
  value: number|string|null;
}

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

  experiences!: SelectOption[];
  contractTypes!: SelectOption[];
  params: JobSearchParams = new JobSearchParams();

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  onClose(): void {
    this.closeFilter.emit();
  }

  onGetSearch(val: JobSearchParams): void{
    this.params = { ...this.params, ...val, experience_max: this.filterForm.value.experience.length>0 ? Math.max(...this.filterForm.value.experience) : undefined, job_type: this.filterForm.value.contract }
    console.log(this.filterForm.value);
    this.filter.emit(this.params);
  }

  private initData(): void {
    this.experiences = [
      { label: 'Débutants', value: 1 },
      { label: '1-2 ans', value: 2 },
      { label: '2-4 ans', value: 4 },
      { label: '4-6 ans', value: 6 },
      { label: '6-8 ans', value: 8 },
      { label: '8-10 ans', value: 10 },
      { label: '10-15 ans', value: 15 },
      { label: '15+ ans', value: 20 }
    ];
    this.contractTypes = [
      { label: 'Tous', value: null },
      { label: 'Emploi', value: 'permanent' },
      { label: 'Stage', value: 'internship' }
    ];
  }
}
