import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './features/admin/admin';
import { AuthGuard } from './core/guards/auth/auth-guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/seeker/seeker-module').then(m => m.SeekerModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule) },
  { path: 'admin', component: Admin, loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
