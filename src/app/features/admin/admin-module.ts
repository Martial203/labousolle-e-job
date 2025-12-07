import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { JobsManagement } from './pages/jobs-management/jobs-management';
import { CategoriesManagement } from './pages/categories-management/categories-management';
import { EnterprisesManagement } from './pages/enterprises-management/enterprises-management';
import { SideMenu } from './components/side-menu/side-menu';
import { Admin } from './admin';


@NgModule({
  declarations: [
    JobsManagement,
    CategoriesManagement,
    EnterprisesManagement,
    SideMenu,
    Admin
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
