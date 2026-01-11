import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-jobs-management',
  standalone: false,
  templateUrl: './jobs-management.html',
  styleUrl: './jobs-management.scss'
})
export class JobsManagement {
  jobs: any[] = [];
  items: MenuItem[] | undefined;

  constructor() {
    this.loadJobs();
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Voir les détails',
        icon: 'pi pi-eye',
      },
      {
        label: 'Marquer comme expiré',
        icon: 'pi pi-times-circle',
      },
      {
        label: 'Modifier',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
      },
    ]
  }


  loadJobs(): void {
    // Replace with actual service call
    this.jobs = [
      { id: 1, title: 'Software Engineer', description: 'Full-stack developer', status: 'Active' },
      { id: 2, title: 'Product Manager', description: 'Lead product strategy', status: 'Active' },
      { id: 3, title: 'Designer', description: 'UI/UX Design', status: 'Inactive' },
    ];
  }

  addJob(): void {
    // Handle add job logic
  }

  editJob(job: any): void {
    // Handle edit job logic
  }

  deleteJob(job: any): void {
    // Handle delete job logic
  }
}
