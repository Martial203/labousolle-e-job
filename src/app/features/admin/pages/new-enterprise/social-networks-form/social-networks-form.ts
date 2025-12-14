import { Component } from '@angular/core';

@Component({
  selector: 'app-social-networks-form',
  standalone: false,
  templateUrl: './social-networks-form.html',
  styleUrl: './social-networks-form.scss',
})
export class SocialNetworksForm {
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
