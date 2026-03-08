import { Component, Input } from '@angular/core';
import { Testimonial } from '../../../../../core/models/testimonial/testimonial';

@Component({
  selector: 'app-testimony',
  standalone: false,
  templateUrl: './testimony.html',
  styleUrl: './testimony.scss',
})
export class Testimony {

  userInitials: string = '';

  @Input() testimonial!: Testimonial;

  ngOnInit(): void {
    if(this.testimonial) this.getInitials();    
  }

  getInitials(): void{
    this.userInitials =  this.testimonial.author.split(" ").map(word => word.charAt(0)).join("").toUpperCase() ?? "";
  }

}
