import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { PrimeNgModule } from './prime-ng/prime-ng-module';
import { Footer } from './components/footer/footer';
import { AdminRoutingModule } from "../features/admin/admin-routing-module";
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderToolbar,
    Footer
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    AdminRoutingModule
],
  exports: [
    HeaderToolbar,
    PrimeNgModule,
    FormsModule,
    Footer
  ]
})
export class SharedModule { }
