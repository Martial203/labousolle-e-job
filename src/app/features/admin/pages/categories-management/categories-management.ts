import { Component, OnInit, ViewChild } from '@angular/core';

export interface Category {
  id?: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-categories-management',
  standalone: false,
  templateUrl: './categories-management.html',
  styleUrl: './categories-management.scss',
})
export class CategoriesManagement {
  
  displayModal: boolean = false;
  categoryName: string = '';
  description: string = '';

  openModal(): void {
    this.displayModal = true;
  }

  saveCategory(): void {
    if (this.categoryName.trim()) {
      const newCategory: Category = {
        name: this.categoryName,
        description: this.description,
        icon: '',
      };
      // TODO: Call your service to save the category
      console.log('Saving category:', newCategory);
      this.resetForm();
      this.displayModal = false;
    }
  }

  private resetForm(): void {
    this.categoryName = '';
    this.description = '';
  }

}

