import { Component } from '@angular/core';

@Component({
  selector: 'app-choose-interests',
  standalone: false,
  templateUrl: './choose-interests.html',
  styleUrl: './choose-interests.scss',
})
export class ChooseInterests {

  selectedInterests: Set<number> = new Set<number>();

  constructor() {}

  toggleInterest(index: number): void {
    if(!this.selectedInterests.delete(index)) this.selectedInterests.add(index);
  }

}
