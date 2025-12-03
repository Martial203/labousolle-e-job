import { Component } from '@angular/core';

@Component({
  selector: 'app-jobs-list',
  standalone: false,
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss',
})
export class JobsList {

  isFilterModalOpen: boolean = false;

  constructor() { }

  onShowFilterModal() {
    this.isFilterModalOpen = true;
    console.log('Filter modal opened');
  }
}
