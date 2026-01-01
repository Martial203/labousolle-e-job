import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

  @Output() onFilterRequested: EventEmitter<void> = new EventEmitter<void>();
  @Input() filtering: boolean = false;

  constructor() { }

  onShowFilterModal() {
    this.onFilterRequested.emit();
  }
}
