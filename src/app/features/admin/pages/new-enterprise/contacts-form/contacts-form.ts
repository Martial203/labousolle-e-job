import { Component } from '@angular/core';

@Component({
  selector: 'app-contacts-form',
  standalone: false,
  templateUrl: './contacts-form.html',
  styleUrl: './contacts-form.scss',
})
export class ContactsForm {
  cities: any[] = [];
  
  ngOnInit() {
    this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
  }
}
