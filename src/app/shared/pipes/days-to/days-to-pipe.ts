import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysTo',
  standalone: false
})
export class DaysToPipe implements PipeTransform {

  transform(value: Date | string | number): string {
    if (!value) return '';

    const targetDate = new Date(value);
    const now = new Date();
    
    // Calcul de la différence en millisecondes
    const diffTime = targetDate.getTime() - now.getTime();
    
    // Si la date est passée
    if (diffTime <= 0) return 'Date passée';

    // Conversion en jours
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''} restant${diffDays > 1 ? 's' : ''}`;
    } else {
      // Approximation en mois (30 jours)
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} mois restant${diffMonths > 1 ? 's' : ''}`;
    }
  }

}
