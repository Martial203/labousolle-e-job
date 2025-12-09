import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { JobsManagement } from './pages/jobs-management/jobs-management';
import { CategoriesManagement } from './pages/categories-management/categories-management';
import { EnterprisesManagement } from './pages/enterprises-management/enterprises-management';
import { SideMenu } from './components/side-menu/side-menu';
import { Admin } from './admin';
import { NewJob } from './pages/new-job/new-job';
import { CategoryForm } from './pages/categories-management/category-form/category-form';
import { EnterpriseForm } from './pages/enterprises-management/enterprise-form/enterprise-form';


@NgModule({
  declarations: [
    JobsManagement,
    CategoriesManagement,
    EnterprisesManagement,
    SideMenu,
    Admin,
    NewJob,
    CategoryForm,
    EnterpriseForm
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
