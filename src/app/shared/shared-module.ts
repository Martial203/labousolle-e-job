import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { PrimeNgModule } from './prime-ng/prime-ng-module';
import { Footer } from './components/footer/footer';
import { AdminRoutingModule } from "../features/admin/admin-routing-module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderToolbar,
    Footer
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
    Footer
  ]
})
export class SharedModule { }
