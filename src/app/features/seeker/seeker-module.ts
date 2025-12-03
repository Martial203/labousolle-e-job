import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeekerRoutingModule } from './seeker-routing-module';
import { Home } from './pages/home/home';
import { SharedModule } from '../../shared/shared-module';
import { JobCard } from './components/job-card/job-card';
import { JobsList } from './pages/jobs-list/jobs-list';
import { JobDetails } from './pages/job-details/job-details';
import { CvBuilder } from './pages/cv-builder/cv-builder';
import { JobCardsList } from './components/job-cards-list/job-cards-list';
import { AdvancedFilter } from './pages/jobs-list/advanced-filter/advanced-filter';
import { OrganizationCard } from './pages/job-details/organization-card/organization-card';
import { ChatHistory } from './pages/cv-builder/chat-history/chat-history';
import { Message } from './pages/cv-builder/message/message';


@NgModule({
  declarations: [
    Home,
    JobCard,
    JobsList,
    JobDetails,
    CvBuilder,
    JobCardsList,
    AdvancedFilter,
    OrganizationCard,
    ChatHistory,
    Message
  ],
  imports: [
    CommonModule,
    SeekerRoutingModule,
    SharedModule
  ]
})
export class SeekerModule { }
