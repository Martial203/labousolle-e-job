import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobSearchParams } from '../../../../../core/models/job/job';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

  @Output() onFilterRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSearch: EventEmitter<JobSearchParams> = new EventEmitter<JobSearchParams>();
  
  @Input() filtering: boolean = false;

  constructor() { }

  onShowFilterModal() {
    this.onFilterRequested.emit();
  }

  onSubmit(params: any): void{
    const searchParams: JobSearchParams = {
      category: params.category,
      city: params.location,
      q: params.title
    }
    this.onSearch.emit(searchParams);
  }
}
