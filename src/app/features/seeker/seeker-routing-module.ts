import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { JobsList } from './pages/jobs-list/jobs-list';
import { JobDetails } from './pages/job-details/job-details';
import { CvBuilder } from './pages/cv-builder/cv-builder';
import { PaymentCallback } from './pages/payment-callback/payment-callback';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'jobs', component: JobsList },
  { path: 'jobs/:id', component: JobDetails },
  { path: 'cv-builder', component: CvBuilder },
  { path: 'cv-builder/:jobId', component: CvBuilder },
  { path: 'payment-callback', component: PaymentCallback }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeekerRoutingModule { }
