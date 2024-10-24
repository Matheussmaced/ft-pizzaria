import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, CircleChevronDown } from 'lucide-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LucideAngularModule.pick({ Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, CircleChevronDown})
  ],
  exports: [
    LucideAngularModule
  ]
})
export class CustomIconsModule { }
