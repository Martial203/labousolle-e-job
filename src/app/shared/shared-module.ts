import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { PrimeNgModule } from './prime-ng/prime-ng-module';
import { Footer } from './components/footer/footer';
import { AdminRoutingModule } from "../features/admin/admin-routing-module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DaysToPipe } from './pipes/days-to/days-to-pipe';



@NgModule({
  declarations: [
    HeaderToolbar,
    Footer,
    DaysToPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    AdminRoutingModule
],
  exports: [
    HeaderToolbar,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    Footer,
    DaysToPipe
  ]
})
export class SharedModule { }
