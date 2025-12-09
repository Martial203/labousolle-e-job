import { Component } from '@angular/core';

export interface Category {
  id?: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm {
 
  
}

