import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-interests',
  standalone: false,
  templateUrl: './choose-interests.html',
  styleUrl: './choose-interests.scss',
})
export class ChooseInterests {

  selectedInterests: Set<number> = new Set<number>();
  interests: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initInterests();
  }

  toggleInterest(index: number): void {
    if(!this.selectedInterests.delete(index)) this.selectedInterests.add(index);
  }

  onSubmit(): void {
    this.router.navigateByUrl('/home');
  }

  private initInterests(): void {
    this.interests = [
      'Administration publique',
      'Agriculture et agronomie',
      'Armée',
      'Cinéma',
      'Education',
      'Elevage',
      'Arts et beaux-arts',
      'Santé',
      'Sciences',
      'Technologie'
    ]
  }
}
