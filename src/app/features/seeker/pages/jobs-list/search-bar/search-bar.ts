import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

  @Output() onFilterRequested: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  onShowFilterModal() {
    this.onFilterRequested.emit();
  }
}
