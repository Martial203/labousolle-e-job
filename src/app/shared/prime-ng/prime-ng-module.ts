import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { EditorModule } from 'primeng/editor';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    CarouselModule,
    DialogModule,
    RadioButtonModule,
    CheckboxModule,
    AccordionModule,
    AvatarModule,
    TableModule,
    TextareaModule,
    TooltipModule,
    InputGroupAddonModule,
    InputGroupModule,
    EditorModule,
    TabsModule,
    SelectModule,
    TagModule,
    PasswordModule
  ]
})
export class PrimeNgModule { }
