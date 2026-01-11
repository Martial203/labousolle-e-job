import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeekerRoutingModule } from './seeker-routing-module';
import { Home } from './pages/home/home';
import { SharedModule } from '../../shared/shared-module';
import { JobsList } from './pages/jobs-list/jobs-list';
import { JobDetails } from './pages/job-details/job-details';
import { CvBuilder } from './pages/cv-builder/cv-builder';
import { JobCardsList } from './components/job-cards-list/job-cards-list';
import { AdvancedFilter } from './pages/jobs-list/advanced-filter/advanced-filter';
import { OrganizationCard } from './pages/job-details/organization-card/organization-card';
import { ChatHistory } from './pages/cv-builder/chat-history/chat-history';
import { Discussion } from './pages/cv-builder/discussion/discussion';
import { Testimony } from './pages/home/testimony/testimony';
import { SearchBar } from './pages/jobs-list/search-bar/search-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatMessageInput } from './pages/cv-builder/chat-message-input/chat-message-input';


@NgModule({
  declarations: [
    Home,
    JobsList,
    JobDetails,
    CvBuilder,
    JobCardsList,
    AdvancedFilter,
    OrganizationCard,
    ChatHistory,
    Discussion,
    Testimony,
    SearchBar,
    ChatMessageInput
  ],
  imports: [
    CommonModule,
    SeekerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SeekerModule { }
