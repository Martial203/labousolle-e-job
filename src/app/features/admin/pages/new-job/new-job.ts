import { Component } from '@angular/core';

@Component({
  selector: 'app-new-job',
  standalone: false,
  templateUrl: './new-job.html',
  styleUrl: './new-job.scss',
})
export class NewJob {
    experiences: string[] = ['Débutants', '1-2 ans', '2-4 ans', '4-6 ans', '6-8 ans', '8-10 ans', '10-15 ans', '15+ ans'];
    contractTypes: string[] = ['Tous', 'Emploi', 'Stage'];
}
