import { Component } from '@angular/core';

@Component({
  selector: 'app-jobs-list',
  standalone: false,
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsList {

  isFilterModalOpen: boolean = false;

  checked: boolean = false;
  activePage: number = 1;
  totalPages: number = 5;

  constructor() { }

  onShowFilterModal() {
    this.isFilterModalOpen = !this.isFilterModalOpen;
    console.log('Filter modal opened');
  }

  onChangePage(page: number): void {
    this.activePage = page;
  }
}
