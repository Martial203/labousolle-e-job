import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsManagement } from './pages/jobs-management/jobs-management';
import { NewJob } from './pages/new-job/new-job';
import { EnterprisesManagement } from './pages/enterprises-management/enterprises-management';
import { NewEnterprise } from './pages/new-enterprise/new-enterprise';

const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobsManagement },
  { path: 'jobs/new', component: NewJob },
  { path: 'enterprises', component: EnterprisesManagement },
  { path: 'enterprises/new', component: NewEnterprise },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
