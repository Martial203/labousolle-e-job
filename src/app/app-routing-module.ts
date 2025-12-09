import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './features/admin/admin';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/seeker/seeker-module').then(m => m.SeekerModule) },
  { path: 'admin', component: Admin, loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule) },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
