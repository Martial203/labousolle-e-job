import { Component } from '@angular/core';

@Component({
  selector: 'app-social-networks-form',
  standalone: false,
  templateUrl: './social-networks-form.html',
  styleUrl: './social-networks-form.scss',
})
export class SocialNetworksForm {

  socialNetworks: string[] = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube'];

  networks: number[] = [0];
  
  ngOnInit() { }

  addAField(): void{
    this.networks.push(this.networks.length);
  }

  removeAField(network: number): void{
    this.networks = this.networks.filter(n => n !== network);
  }
}
