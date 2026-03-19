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
      { label: 'Aucune expérience', value: 0 },
      { label: 'Moins de 1 an', value: 1 },
      { label: '1 à 2 ans', value: 2 },
      { label: '2 à 3 ans', value: 3 },
      { label: '3 à 5 ans', value: 5 },
      { label: '5 à 7 ans', value: 7 },
      { label: '7 à 10 ans', value: 10 },
      { label: 'Plus de ans', value: 20 }
    ];
    this.contractTypes = [
      { label: 'Tous', value: null },
      { label: 'Emploi', value: 'permanent' },
      { label: 'Stage', value: 'internship' }
    ];
  }
}
