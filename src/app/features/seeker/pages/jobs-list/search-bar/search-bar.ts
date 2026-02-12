import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobSearchParams } from '../../../../../core/models/job/job';
import { Category } from '../../../../../core/models/category/category';
import { Observable } from 'rxjs';
import { JobService } from '../../../../../core/services/job/job.service';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

  categories$!: Observable<Category[]>;

  @Output() onFilterRequested: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSearch: EventEmitter<JobSearchParams> = new EventEmitter<JobSearchParams>();
  
  @Input() filtering: boolean = false;

  constructor(private jobService: JobService) { }

  onShowFilterModal() {
    this.onFilterRequested.emit();
  }

  ngOnInit(): void {
    this.categories$ = this.jobService.categories$;
  }

  onSubmit(params: any): void{
    const searchParams: JobSearchParams = {
      category: params.category.toLowerCase(),
      city: params.location,
      q: params.title
    }
    this.onSearch.emit(searchParams);
  }
}
