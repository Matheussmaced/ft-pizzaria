import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, Download, CircleChevronDown, Trash2 } from 'lucide-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LucideAngularModule.pick({Download, Trash2, Armchair, FileText, ScrollText, PackageSearch, CircleDollarSign, LogOut, CircleChevronDown})
  ],
  exports: [
    LucideAngularModule
  ]
})
export class CustomIconsModule { }
