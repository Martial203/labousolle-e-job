import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter',
  standalone: false,
  templateUrl: './advanced-filter.html',
  styleUrl: './advanced-filter.scss',
})
export class AdvancedFilter {

  @Output() closeFilter: EventEmitter<void> = new EventEmitter<void>();

  experiences!: String[];
  contractTypes!: String[];

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  onClose(): void {
    this.closeFilter.emit();
  }

  private initData(): void {
    this.experiences = ['Débutants', '1-2 ans', '2-4 ans', '4-6 ans', '6-8 ans', '8-10 ans', '10-15 ans', '15+ ans'];
    this.contractTypes = ['Tous', 'Emploi', 'Stage'];
  }
}
