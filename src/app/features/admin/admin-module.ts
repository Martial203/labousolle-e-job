import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { JobsManagement } from './pages/jobs-management/jobs-management';
import { EnterprisesManagement } from './pages/enterprises-management/enterprises-management';
import { SideMenu } from './components/side-menu/side-menu';
import { Admin } from './admin';
import { NewJob } from './pages/new-job/new-job';
import { NewEnterprise } from './pages/new-enterprise/new-enterprise';
import { ContactsForm } from './pages/new-enterprise/contacts-form/contacts-form';
import { GeneralInfosForm } from './pages/new-enterprise/general-infos-form/general-infos-form';
import { SocialNetworksForm } from './pages/new-enterprise/social-networks-form/social-networks-form';


@NgModule({
  declarations: [
    JobsManagement,
    EnterprisesManagement,
    SideMenu,
    Admin,
    NewJob,
    NewEnterprise,
    ContactsForm,
    GeneralInfosForm,
    SocialNetworksForm
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
