import { JobService } from './../../../../core/services/job/job.service';
import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { Job } from '../../../../core/models/job/job';

interface JobRow {
  id: number;
  title: string;
  company: string;
  category: string;
  type: string;
  expirationDate: Date;
}

@Component({
  selector: 'app-jobs-management',
  standalone: false,
  templateUrl: './jobs-management.html',
  styleUrl: './jobs-management.scss'
})
export class JobsManagement {
  
  jobs$!: Observable<Job[]>;
  items: MenuItem[] | undefined;

  constructor(private jobService: JobService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {
    this.jobs$ = this.jobService.jobs$;
  }

  mapToJobRow(jobs: Job[]): JobRow[] {
    if(!jobs) return [];
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.companyName,
      category: job.categoryName,
      type: job.jobType,
      expirationDate: new Date(job.expirationDate)
    }))
  }

  confirmDeletion(jobId: number): void {
    this.confirmationService.confirm({
      message: "Voulez vous vraiment supprimer cette offre d'emploi?",
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'danger'
      },
      accept: () => {
        this.deleteJob(jobId);
        this.messageService.add({ severity: 'primary', summary: 'Confirmé', detail: 'Offre supprimée avec succès.', styleClass: "w-[90%]" });
      }
    });
  }

  addJob(): void {
    // Handle add job logic
    alert("DDDD")
  }

  editJob(job: any): void {
    // Handle edit job logic
  }

  deleteJob(job: any): void {
    this.jobService.deleteAJob(job).subscribe()
  }
}
